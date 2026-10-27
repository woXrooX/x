import { download_CSV } from "/JavaScript/modules/parser/CSV.js";

export default class Table extends HTMLElement {
	/////////////////////////// Static

	/////////// Variables

	// Only ever increments, so every live table keeps a unique internal ID
	static #last_ID = 0;

	static #sort_directions = Object.freeze({ASC: "ASC", DESC: "DESC"});

	static #collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"});


	/////////// APIs

	static build(JSON, classes = null) {
		const table = document.createElement("x-table");

		if (typeof(classes) === "string" && classes.trim() !== '') table.classList.add(...classes.trim().split(/\s+/));

		table.JSON = JSON;

		return table;
	}


	/////////// Helpers

	// Row ids are compared as strings, so 123 and "123" are the same row
	static #normalize_id(id) {
		if (typeof(id) === "number" && Number.isFinite(id)) return String(id);
		if (typeof(id) === "string" && id !== '') return id;

		throw new TypeError(`Table: "id" must be a non-empty string or a finite number.`);
	}

	static #parse_page_size(value) {
		if (value === undefined || value === false || value === "all") return "all";

		const page_size = parseInt(value);

		if (Number.isNaN(page_size) || page_size <= 0) return 10;

		return page_size;
	}

	// Shallow copies, so outside code can't change stored cells by mutating what it passed or got
	static #copy_cells(data) {
		const cells = [];

		for (const cell of data) cells.push({...cell});

		return cells;
	}

	// The public shape of a row, as get_row() and get_checked_rows() return it
	static #export_row(record) {
		return {id: record.id, classes: record.classes, data: Table.#copy_cells(record.data)};
	}

	// Displayed text of a <td>, used by search and CSV
	static #cell_text(td) {
		return td.textContent.replace(/\s+/g, ' ').trim();
	}

	// A raw value as text, used by search, sort and plain display. Lists become comma-separated.
	static #raw_text(value) {
		if (value === null || value === undefined) return '';
		if (Array.isArray(value)) return value.join(", ");

		return String(value);
	}

	static #is_empty_value(value) {
		return Table.#raw_text(value).trim() === '';
	}

	static #to_number(value) {
		if (typeof(value) === "number") return Number.isFinite(value) ? value : null;
		if (typeof(value) !== "string" || value.trim() === '') return null;

		const number = Number(value);

		return Number.isNaN(number) ? null : number;
	}

	// Total order of raw values: numbers first (numerically), then text (natural, case-insensitive)
	static #compare_values(a, b) {
		const a_number = Table.#to_number(a);
		const b_number = Table.#to_number(b);

		if (a_number !== null && b_number !== null) return a_number - b_number;
		if (a_number !== null) return -1;
		if (b_number !== null) return 1;

		return Table.#collator.compare(Table.#raw_text(a), Table.#raw_text(b));
	}

	static #escape_regex(value) {
		return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	// Adds a range for every match of "regex" in the text nodes under "root"
	static #add_highlight_ranges(highlight, root, regex) {
		const tree_walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

		while (tree_walker.nextNode()) {
			const node = tree_walker.currentNode;

			for (const match of node.textContent.matchAll(regex)) {
				const range = new Range();
				range.setStart(node, match.index);
				range.setEnd(node, match.index + match[0].length);
				highlight.add(range);
			}
		}
	}


	/////////////////////////// Object

	/////////// Variables

	#ID = 0;
	#highlight_name = '';
	#is_initialized = false;

	#JSON = false;

	/*
		Master data: key (stringified id) -> {key, id, classes, data, tr, cells, checkbox, order}. Map keeps insertion order.
		"cells" are the data <td>s, aligned with "data" and "columns". The <tr> can hold more, like the checkbox cell.
	*/
	#records = new Map();
	#next_order = 0;

	// Records matching the search, in display order (sort, then insertion order)
	#view = [];

	// {value, column_index, column_value} or null
	#search = null;

	// {column_index, direction} or null
	#sort = null;

	#is_checkable = false;

	// Keys of the checked rows. This is the truth; each row's checkbox only reflects it.
	#checked_keys = new Set();

	// Row checkbox -> record, for the delegated change listener
	#record_by_checkbox = new WeakMap();

	#page_size = "all";
	#current_page = 1;

	#batch_size = 100;
	#drawn_count = 0;
	#lazy_draw_observer = null;
	#lazy_draw_loader_element = null;
	#empty_state_element = null;

	#header_element = null;
	#main_element = null;
	#tbody_element = null;
	#footer_element = null;
	#pagination_elements = null;

	// Data <th>s, aligned with "columns". The select-all <th> is kept apart.
	#head_cells = null;
	#check_all_element = null;


	/////////// APIs

	constructor() {
		super();

		Table.#last_ID += 1;
		this.#ID = Table.#last_ID;
		this.#highlight_name = `x-table-${this.#ID}`;
	}

	connectedCallback() {
		if (this.#is_initialized === true) {
			// Re-attached after being moved in the DOM: resume lazy draw and highlights
			this.#sync_lazy_draw_loader();
			this.#apply_search_highlights();
			return;
		}

		this.#init_core();
	}

	disconnectedCallback() {
		this.#lazy_draw_observer?.disconnect();
		CSS.highlights.delete(this.#highlight_name);
	}

	set JSON(value) {
		if (this.#is_initialized === true) return;

		this.#accept_JSON(value);
	}

	add_row(row) {
		this.#assert_initialized();

		const record = this.#create_record(row);
		this.#records.set(record.key, record);

		this.#refresh();

		if (this.#checked_keys.has(record.key)) this.#dispatch_check_change();
	}

	update_row(row) {
		this.#assert_initialized();

		this.#validate_row(row);

		const record = this.#records.get(Table.#normalize_id(row["id"]));

		if (record === undefined) return false;

		/*
			The given row is the new truth: classes and cells are replaced, not merged.
			The checked state is kept; a "checked" in the row only applies when the row is created.
		*/
		record.classes = row["classes"] ?? '';
		record.data = Table.#copy_cells(row["data"]);

		/*
			Same <tr>, new cells: references held by outside code stay valid.
			Only the data cells are swapped; the checkbox cell stays in place, so it doesn't lose focus.
		*/
		record.tr.className = record.classes;

		for (const td of record.cells) td.remove();

		record.cells = this.#create_cells(record.data);
		record.tr.append(...record.cells);

		this.#refresh();

		return true;
	}

	remove_row(id) {
		this.#assert_initialized();

		const record = this.#records.get(Table.#normalize_id(id));

		if (record === undefined) return false;

		this.#records.delete(record.key);

		const was_checked = this.#checked_keys.delete(record.key);

		this.#refresh();

		if (was_checked) this.#dispatch_check_change();

		return true;
	}

	get_row(id) {
		this.#assert_initialized();

		const record = this.#records.get(Table.#normalize_id(id));

		if (record === undefined) return null;

		return Table.#export_row(record);
	}

	// In insertion order, including checked rows the current search hides
	get_checked_rows() {
		this.#assert_checkable();

		const rows = [];

		for (const record of this.#records.values())
			if (this.#checked_keys.has(record.key)) rows.push(Table.#export_row(record));

		return rows;
	}

	// Returns false when there's no such row
	set_checked(id, checked) {
		this.#assert_checkable();

		if (typeof(checked) !== "boolean") throw new TypeError("Table: \"checked\" must be a boolean.");

		const record = this.#records.get(Table.#normalize_id(id));

		if (record === undefined) return false;

		if (this.#set_record_checked(record, checked)) {
			this.#render_check_state();
			this.#dispatch_check_change();
		}

		return true;
	}

	uncheck_all() {
		this.#assert_checkable();

		if (this.#checked_keys.size === 0) return;

		// Walks only the checked rows, not every record
		for (const key of this.#checked_keys) this.#records.get(key).checkbox.checked = false;

		this.#checked_keys.clear();

		this.#render_check_state();
		this.#dispatch_check_change();
	}


	/////////// Helpers

	//// Init

	#init_core = () => {
		if (this.#JSON === false) {
			let parsed;

			try { parsed = JSON.parse(this.textContent); }
			catch (error) { throw new TypeError("Table: content is not valid JSON."); }

			this.#accept_JSON(parsed);
		}

		this.#page_size = Table.#parse_page_size(this.#JSON["page_size"]);
		this.#is_checkable = "checkable" in this.#JSON && this.#JSON["checkable"] !== false;

		for (const row of this.#JSON["rows"] ?? []) {
			const record = this.#create_record(row);
			this.#records.set(record.key, record);
		}

		this.#build_DOM();
		this.#init_body_helpers();

		this.#listen_to_page_size_change();
		this.#listen_to_search_typing();
		this.#listen_to_CSV_download_click();
		this.#listen_to_sort_clicks();
		this.#listen_to_pagination_clicks();
		this.#listen_to_check_changes();

		this.#is_initialized = true;

		this.#refresh(1);
	};

	#accept_JSON = (value) => {
		if (value === null || typeof(value) !== "object" || Array.isArray(value))
			throw new TypeError("Table: JSON must be an object.");

		if (!Array.isArray(value["columns"]) || value["columns"].length === 0)
			throw new TypeError(`Table: "columns" must be a non-empty array.`);

		for (const column of value["columns"]) {
			if (column === null || typeof(column) !== "object" || !("title" in column))
				throw new TypeError(`Table: every column must be an object with a "title".`);

		}

		if ("rows" in value && !Array.isArray(value["rows"])) throw new TypeError(`Table: "rows" must be an array.`);

		// Our own id, known to outside code: x-table#users tr#row_123
		if ("id" in value) this.id = Table.#normalize_id(value["id"]);

		this.#JSON = value;
	};

	#assert_initialized = () => {
		if (this.#is_initialized === false)
			throw new Error("Table: not initialized yet, append the element to the DOM first.");
	};

	#assert_checkable = () => {
		this.#assert_initialized();

		if (this.#is_checkable === false)
			throw new Error("Table: not checkable, enable it with \"checkable\": true.");
	};


	//// Records

	#create_record = (row) => {
		this.#validate_row(row);

		const key = Table.#normalize_id(row["id"]);

		if (this.#records.has(key)) throw new Error(`Table: duplicate row id "${key}".`);

		const classes = row["classes"] ?? '';
		const data = Table.#copy_cells(row["data"]);
		const cells = this.#create_cells(data);

		// Built once and reused for the row's whole life
		const tr = document.createElement("tr");
		tr.id = `row_${key}`;
		tr.className = classes;

		const record = {key, id: row["id"], classes, data, tr, cells, checkbox: null, order: this.#next_order++};

		// The checkbox cell goes first, outside "cells"
		if (this.#is_checkable) tr.append(this.#create_checkbox_cell(record));

		tr.append(...cells);

		// "checked" is only the initial state, like the HTML checked attribute
		if (this.#is_checkable && row["checked"] === true) this.#set_record_checked(record, true);

		return record;
	};

	#validate_row = (row) => {
		if (row === null || typeof(row) !== "object" || Array.isArray(row))
			throw new TypeError(`Table: a row must be an object like {"id": ..., "data": [{"value": ...}]}.`);

		// Validates the id's type; existence is checked by the caller
		Table.#normalize_id(row["id"]);

		if ("classes" in row && typeof(row["classes"]) !== "string") throw new TypeError(`Table: row "classes" must be a string.`);

		if ("checked" in row && typeof(row["checked"]) !== "boolean") throw new TypeError("Table: row \"checked\" must be a boolean.");

		const column_count = this.#JSON["columns"].length;

		if (!Array.isArray(row["data"]) || row["data"].length !== column_count)
			throw new TypeError(`Table: row "data" must be an array of ${column_count} cells.`);

		for (const cell of row["data"]) {
			if (cell === null || typeof(cell) !== "object" || Array.isArray(cell))
				throw new TypeError(`Table: every cell must be an object like {"value": ..., "formatted_value": ...}.`);

			if (cell["value"] === undefined && cell["formatted_value"] === undefined)
				throw new TypeError(`Table: a cell needs a "value", a "formatted_value", or both.`);

			if (cell["value"] !== null && typeof(cell["value"]) === "object" && !Array.isArray(cell["value"]))
				throw new TypeError(`Table: a cell "value" can't be an object; display it through "formatted_value" instead.`);

			if (cell["formatted_value"] !== undefined && typeof(cell["formatted_value"]) !== "string" && typeof(cell["formatted_value"]) !== "number")
				throw new TypeError(`Table: a cell "formatted_value" must be a string or a number.`);

			if ("classes" in cell && typeof(cell["classes"]) !== "string")
				throw new TypeError(`Table: cell "classes" must be a string.`);
		}
	};

	// "formatted_value" always wins for display (as HTML); otherwise the raw value is shown as plain text
	#create_cells = (data) => {
		const tds = [];

		for (const cell of data) {
			const td = document.createElement("td");

			if (cell["formatted_value"] !== undefined) td.innerHTML = cell["formatted_value"];
			else td.textContent = Table.#raw_text(cell["value"]);

			if (cell["classes"] !== undefined) td.className = cell["classes"];

			tds.push(td);
		}

		return tds;
	};


	//// View (search + sort)

	#rebuild_view = () => {
		this.#view = [];

		for (const record of this.#records.values())
			if (this.#matches_search(record)) this.#view.push(record);

		this.#view.sort(this.#compare_records);
	};

	// Sorts by raw values; insertion order is the tie-breaker, so the order is always deterministic
	#compare_records = (a, b) => {
		if (this.#sort !== null) {
			const column_index = this.#sort.column_index;
			const a_value = this.#sort_value(a, column_index);
			const b_value = this.#sort_value(b, column_index);
			const a_is_empty = Table.#is_empty_value(a_value);
			const b_is_empty = Table.#is_empty_value(b_value);

			// Empty values always go last, whatever the direction
			if (a_is_empty !== b_is_empty) return a_is_empty ? 1 : -1;

			if (a_is_empty === false) {
				let result = Table.#compare_values(a_value, b_value);

				if (this.#sort.direction === Table.#sort_directions.DESC) result = -result;

				if (result !== 0) return result;
			}
		}

		return a.order - b.order;
	};

	/*
		The cell's "value" when it has one (null included: it means empty), otherwise its displayed text.
		The text is read live from the DOM, so a cell edited in place sorts by what it shows now.
	*/
	#sort_value = (record, column_index) => {
		const value = record.data[column_index]["value"];

		if (value !== undefined) return value;

		return Table.#cell_text(record.cells[column_index]);
	};

	#parse_search = (input_value) => {
		const value = input_value.replace(/\s+/g, ' ').trim().toLowerCase();

		if (value === '') return null;

		const search = {value, column_index: null, column_value: ''};

		// "title:value" searches inside the first column whose title contains "title"
		const title_and_value = value.match(/^(.*?):(.*)$/);

		if (title_and_value === null) return search;

		const title = title_and_value[1].trim();

		if (title === '') return search;

		const columns = this.#JSON["columns"];
		let column_index = -1;

		for (let index = 0; index < columns.length; index++)
			if (String(columns[index]["title"]).toLowerCase().includes(title)) {
				column_index = index;
				break;
			}

		if (column_index === -1) return search;

		search.column_index = column_index;
		search.column_value = title_and_value[2].trim();

		return search;
	};

	#matches_search = (record) => {
		if (this.#search === null) return true;

		const column_index = this.#search.column_index;

		if (column_index !== null && this.#cell_matches(record, column_index, this.#search.column_value)) return true;

		for (let index = 0; index < record.data.length; index++)
			if (this.#cell_matches(record, index, this.#search.value)) return true;

		return false;
	};

	// A cell matches when the term is in its raw value (if any) or in what it displays, read live from the DOM
	#cell_matches = (record, column_index, term) => {
		const value = record.data[column_index]["value"];

		if (value !== undefined && Table.#raw_text(value).toLowerCase().includes(term)) return true;

		return Table.#cell_text(record.cells[column_index]).toLowerCase().includes(term);
	};


	//// Pages

	#effective_page_size = () => this.#page_size === "all" ? Math.max(this.#view.length, 1) : this.#page_size;

	#page_count = () => Math.max(Math.ceil(this.#view.length / this.#effective_page_size()), 1);

	#page_start_index = () => (this.#current_page - 1) * this.#effective_page_size();

	#page_length = () => Math.max(Math.min(this.#effective_page_size(), this.#view.length - this.#page_start_index()), 0);

	/*
		The single path for every change: master data, search, sort, page size and page.
		Derives the view from the master data and the current state, then renders it.
		"page" moves to that page; otherwise the current page is kept (clamped if it no longer exists).
		A page change draws from the first batch; any other change keeps the rows already drawn.
		Checking rows doesn't change the view, so it skips this path and only calls #render_check_state.
	*/
	#refresh = (page = this.#current_page) => {
		const is_page_change = page !== this.#current_page;

		this.#rebuild_view();

		this.#current_page = Math.min(Math.max(page, 1), this.#page_count());

		this.#render_body(is_page_change ? this.#batch_size : Math.max(this.#drawn_count, this.#batch_size));
		this.#render_footer();
		this.#render_check_state();
	};


	//// Body

	/*
		Makes the <tbody> hold exactly the first "drawn_count" rows of the current page, touching only what differs.
		1. Removes everything that shouldn't be drawn: removed or filtered-out rows, other pages' rows, loader, empty state.
		2. Walks the wanted rows in order: rows already in place are skipped, missing ones are inserted,
		and a row that moved down is detached and re-inserted at its new place.
		So one add, remove, update or move costs one or two DOM operations.
	*/
	#render_body = (drawn_count) => {
		const start = this.#page_start_index();
		const page_length = this.#page_length();

		this.#drawn_count = Math.min(drawn_count, page_length);

		const wanted_rows = [];

		for (let index = start; index < start + this.#drawn_count; index++) wanted_rows.push(this.#view[index].tr);

		const wanted_rows_set = new Set(wanted_rows);
		const children = this.#tbody_element.children;

		// Backwards, because removing shrinks the live collection
		for (let index = children.length - 1; index >= 0; index--)
			if (!wanted_rows_set.has(children[index])) children[index].remove();

		let node = this.#tbody_element.firstElementChild;

		for (const tr of wanted_rows) {
			if (node !== null && node !== tr && node.nextElementSibling === tr) {
				const moved_node = node;
				node = tr;
				moved_node.remove();
			}

			if (node === tr) node = node.nextElementSibling;
			else this.#tbody_element.insertBefore(tr, node);
		}

		if (page_length === 0) this.#show_empty_state();

		this.#sync_lazy_draw_loader();
		this.#apply_search_highlights();
	};

	#show_empty_state = () => {
		this.#empty_state_element.firstElementChild.innerHTML = window.Lang.use(this.#search === null ? "no_data" : "no_matches");
		this.#tbody_element.appendChild(this.#empty_state_element);
	};

	#init_body_helpers = () => {
		// The checkbox cell is layout, not data, so it only counts here
		const column_count = this.#JSON["columns"].length + (this.#is_checkable ? 1 : 0);

		this.#empty_state_element = document.createElement("tr");
		this.#empty_state_element.innerHTML = `<td colspan="${column_count}"></td>`;

		this.#lazy_draw_loader_element = document.createElement("tr");
		this.#lazy_draw_loader_element.innerHTML = `<td colspan="${column_count}" class="width-100 height-50px padding-5 loading-on-element loading-on-element-bg-unset"></td>`;

		this.#lazy_draw_observer = new IntersectionObserver(
			(entries) => {
				if (entries.at(-1).isIntersecting === false) return;

				this.#render_body(this.#drawn_count + this.#batch_size);
			},
			{root: this.#main_element, threshold: 0.5}
		);
	};

	#sync_lazy_draw_loader = () => {
		this.#lazy_draw_observer.unobserve(this.#lazy_draw_loader_element);

		if (this.#drawn_count >= this.#page_length()) {
			this.#lazy_draw_loader_element.remove();
			return;
		}

		this.#tbody_element.appendChild(this.#lazy_draw_loader_element);

		// Re-observing reports the loader's current state, so drawing continues while it is still visible
		this.#lazy_draw_observer.observe(this.#lazy_draw_loader_element);
	};


	//// Highlight

	/*
		Mirrors #matches_search: the full term in every cell, the column term only in its column.
		Walks only the drawn rows, so the empty state and the loader are never highlighted.
	*/
	#apply_search_highlights = () => {
		CSS.highlights.delete(this.#highlight_name);

		if (this.#search === null) return;

		const column_index = this.#search.column_index;
		const full_regex = new RegExp(Table.#escape_regex(this.#search.value), "gi");
		let column_regex = null;

		if (column_index !== null && this.#search.column_value !== '')
			column_regex = new RegExp(Table.#escape_regex(this.#search.column_value), "gi");

		const highlight = new Highlight();
		const start = this.#page_start_index();

		for (let index = start; index < start + this.#drawn_count; index++) {
			const cells = this.#view[index].cells;

			for (const cell of cells) Table.#add_highlight_ranges(highlight, cell, full_regex);

			if (column_regex !== null) Table.#add_highlight_ranges(highlight, cells[column_index], column_regex);
		}

		if (highlight.size > 0) CSS.highlights.set(this.#highlight_name, highlight);
	};


	//// DOM

	#build_DOM = () => {
		this.innerHTML = `
			<container class="height-100 gap-0-5">

				<header
					class="
						display-flex
						flex-row
						align-items-center
						justify-content-space-between
						gap-0-5
						width-100
						empty-display-none
					"
				>${
					this.#build_page_size_HTML() +
					this.#build_search_HTML() +
					this.#build_download_HTML()
				}</header>

				<main class="width-100 min-height-0">
					<section class="table-container table-thead-sticky scrollbar-x height-100">
						<table>
							<caption class="empty-display-none">${this.#JSON["caption"] ?? ''}</caption>
							<thead><tr>${this.#build_head_HTML()}</tr></thead>
							<tbody></tbody>
							<tfoot><tr>${this.#build_foot_HTML()}</tr></tfoot>
						</table>
					</section>
				</main>

				${this.#build_footer_HTML()}

			</container>

			<style>
				::highlight(${this.#highlight_name}) {
					background-color: var(--color-error);
					color: white;
				}
			</style>
		`;

		// Cached once, so later queries can't hit a nested table inside a cell
		this.#header_element = this.querySelector(":scope > container > header");
		this.#main_element = this.querySelector(":scope > container > main");
		this.#tbody_element = this.#main_element.querySelector("table > tbody");
		this.#footer_element = this.querySelector(":scope > container > footer");
		this.#head_cells = Array.from(this.#main_element.querySelector("table > thead > tr").children);

		if (this.#is_checkable) this.#check_all_element = this.#head_cells.shift().querySelector("input");

		if (this.#footer_element === null) return;

		const navigation = this.#footer_element.querySelector(":scope > section:nth-child(2)");

		this.#pagination_elements = {
			navigation,
			first: navigation.querySelector(":scope > x-svg[name=arrow_left_first_page]"),
			previous: navigation.querySelector(":scope > x-svg[name=arrow_back_v1]"),
			numbers: navigation.querySelector(":scope > section"),
			next: navigation.querySelector(":scope > x-svg[name=arrow_forward_v1]"),
			last: navigation.querySelector(":scope > x-svg[name=arrow_right_last_page]")
		};
	};

	#build_page_size_HTML = () => {
		if (
			!("page_size" in this.#JSON) ||
			this.#JSON["page_size"] === false
		) return '';

		const label = this.#page_size === "all" ? window.Lang.use("all") : this.#page_size;

		return `
			<select
				class="
					text-align-center
					width-auto
					min-width-75px
					box-shadow-v0
				"
				style="outline-offset: -1px;"
			>
				<option selected disabled>${label}</option>
				<option value="10">10</option>
				<option value="15">15</option>
				<option value="20">20</option>
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="100">100</option>
				<option value="all">${window.Lang.use("all")}</option>
			</select>
		`;
	};

	#build_search_HTML = () => {
		if (
			!("searchable" in this.#JSON) ||
			this.#JSON["searchable"] === false
		) return '';

		return `
			<input
				class="
					width-100
					box-shadow-v0
				"

				type="text"
				placeholder="${window.Lang.use("type_to_search")}"
				name="search"

				style="outline-offset: -1px;"
			>
		`;
	};

	#build_download_HTML = () => {
		if (
			!("downloadable" in this.#JSON) ||
			this.#JSON["downloadable"] === false
		) return '';

		return `
			<x-svg id="download_CSV_${this.#ID}" name="download_v2" color="white" class="btn btn-primary"></x-svg>
			<x-tooltip trigger_selector="x-svg#download_CSV_${this.#ID}" class="padding-1 text-size-0-6rem">${window.Lang.use("download_as_CSV")}</x-tooltip>
		`;
	};

	#build_head_HTML = () => {
		let HTML = '';

		if (this.#is_checkable)
			HTML += `
				<th class="width-1px padding-0">
					<label class="display-flex justify-content-center align-items-center padding-2 cursor-pointer">
						<input type="checkbox" aria-label="${window.Lang.use("select_all")}">
					</label>
				</th>
			`;

		for (const column of this.#JSON["columns"]) {
			const is_sortable = column["sortable"] !== false;

			HTML += `
				<th>
					<row class="${is_sortable ? "cursor-pointer " : ''}gap-0-5 flex-row align-items-center justify-content-flex-start">
						${column["title"]}
						${is_sortable ? '<x-svg name="sort_ASC" toggle="sort_DESC"></x-svg>' : ''}
					</row>
				</th>
			`;
		}

		return HTML;
	};

	#build_foot_HTML = () => {
		let HTML = '';

		for (const cell of this.#JSON["foot"] ?? []) HTML += `<td>${cell}</td>`;

		// Keeps the foot cells under their columns
		if (HTML !== '' && this.#is_checkable) HTML = "<td></td>" + HTML;

		return HTML;
	};

	#build_footer_HTML = () => {
		if (
			!("page_size" in this.#JSON) ||
			this.#JSON["page_size"] === false
		) return '';

		return `
			<footer class="display-flex flex-row s-flex-column justify-content-space-between gap-1 width-100">
				<section class="display-flex flex-row justify-content-flex-start align-items-center gap-0-5 text-size-0-8rem">
					<span class="page_numbers"></span>
					<span class="total_rows"></span>
					<span class="matched_rows"></span>
					<span class="checked_rows"></span>
				</section>

				<section class="display-flex flex-row justify-content-flex-end gap-0-2">
					<x-svg name="arrow_left_first_page" color="white" class="btn btn-primary btn-s"></x-svg>
					<x-svg name="arrow_back_v1" color="white" class="btn btn-primary btn-s"></x-svg>
					<section class="display-flex flex-row gap-0-2"></section>
					<x-svg name="arrow_forward_v1" color="white" class="btn btn-primary btn-s"></x-svg>
					<x-svg name="arrow_right_last_page" color="white" class="btn btn-primary btn-s"></x-svg>
				</section>
			</footer>
		`;
	};


	//// Footer

	#render_footer = () => {
		if (this.#footer_element === null) return;

		const page_count = this.#page_count();
		const current_page = this.#current_page;

		this.#footer_element.querySelector(".page_numbers").innerHTML = `
			<span class="text-color-secondary text-size-0-7rem">Page</span>
			${current_page}
			<span class="text-color-secondary text-size-0-7rem">of</span>
			${page_count}
		`;

		this.#footer_element.querySelector(".total_rows").innerHTML = `
			<span class="text-color-secondary text-size-0-7rem">Total rows:</span> ${this.#records.size}
		`;

		this.#footer_element.querySelector(".matched_rows").innerHTML = this.#search === null ? '' : `
			<span class="text-color-secondary text-size-0-7rem">Matched rows:</span> ${this.#view.length}
		`;

		this.#set_page_target(this.#pagination_elements.first, 1);
		this.#set_page_target(this.#pagination_elements.previous, current_page - 1);
		this.#set_page_target(this.#pagination_elements.next, current_page + 1);
		this.#set_page_target(this.#pagination_elements.last, page_count);

		let buttons_HTML = '';

		for (let page = Math.max(current_page - 1, 1); page <= Math.min(current_page + 1, page_count); page++) {
			const current_classes = page === current_page ? " disabled text-decoration-underline" : '';

			buttons_HTML += `<button class="btn btn-primary btn-s${current_classes}" data-page="${page}">${page}</button>`;
		}

		this.#pagination_elements.numbers.innerHTML = buttons_HTML;
	};

	#set_page_target = (element, page) => {
		element.setAttribute("data-page", page);
		element.classList.toggle("disabled", page < 1 || page > this.#page_count() || page === this.#current_page);
	};


	//// Check

	// Its own cell, outside "cells", so data columns keep their indexes. Fills record.checkbox.
	#create_checkbox_cell = (record) => {
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.setAttribute("aria-label", window.Lang.use("select_row"));

		// The label takes the cell's padding, so the click area is larger than the checkbox
		const label = document.createElement("label");
		label.className = "display-flex justify-content-center align-items-center padding-2 cursor-pointer";
		label.append(checkbox);

		const td = document.createElement("td");
		td.className = "width-1px padding-0";
		td.append(label);

		record.checkbox = checkbox;
		this.#record_by_checkbox.set(checkbox, record);

		return td;
	};

	// Keeps the Set and the row's checkbox in step. Returns whether anything changed.
	#set_record_checked = (record, checked) => {
		if (this.#checked_keys.has(record.key) === checked) return false;

		if (checked) this.#checked_keys.add(record.key);
		else this.#checked_keys.delete(record.key);

		record.checkbox.checked = checked;

		return true;
	};

	/*
		Header checkbox: checked when every row in the view is checked, indeterminate when only some are.
		It stays unchecked while indeterminate, so clicking it checks all.
		The footer shows the total, including checked rows the view hides.
	*/
	#render_check_state = () => {
		if (this.#is_checkable === false) return;

		const view_length = this.#view.length;
		let checked_in_view = 0;

		for (const record of this.#view)
			if (this.#checked_keys.has(record.key)) checked_in_view++;

		this.#check_all_element.checked = view_length > 0 && checked_in_view === view_length;
		this.#check_all_element.indeterminate = checked_in_view > 0 && checked_in_view < view_length;
		this.#check_all_element.disabled = view_length === 0;

		if (this.#footer_element === null) return;

		const checked_count = this.#checked_keys.size;

		this.#footer_element.querySelector(".checked_rows").innerHTML = checked_count === 0 ? '' : `
			<span class="text-color-secondary text-size-0-7rem">${window.Lang.use("checked_rows")}:</span> ${checked_count}
		`;
	};

	#dispatch_check_change = () => {
		this.dispatchEvent(new CustomEvent("check_change", {detail: {count: this.#checked_keys.size}}));
	};


	//// Listeners

	#listen_to_page_size_change = () => {
		const element = this.#header_element.querySelector(":scope > select");

		if (element === null) return;

		element.onchange = () => {
			this.#page_size = Table.#parse_page_size(element.value);
			this.#refresh(1);
		};
	};

	#listen_to_search_typing = () => {
		const element = this.#header_element.querySelector(":scope > input[name=search]");

		if (element === null) return;

		let debounce_timeout;

		element.oninput = () => {
			clearTimeout(debounce_timeout);

			debounce_timeout = setTimeout(() => {
				this.#search = this.#parse_search(element.value);
				this.#refresh(1);
			}, 500);
		};
	};

	#listen_to_CSV_download_click = () => {
		const element = this.#header_element.querySelector(`:scope > x-svg#download_CSV_${this.#ID}`);

		if (element === null) return;

		element.onclick = () => {
			const CSV_head = [];

			for (const column of this.#JSON["columns"]) CSV_head.push(String(column["title"]));

			const CSV_data = [CSV_head];

			for (const record of this.#view) {
				const CSV_row = [];

				for (const cell of record.cells) CSV_row.push(Table.#cell_text(cell));

				CSV_data.push(CSV_row);
			}

			download_CSV(CSV_data);
		};
	};

	#listen_to_sort_clicks = () => {
		for (let column_index = 0; column_index < this.#head_cells.length; column_index++) {
			const x_svg_element = this.#head_cells[column_index].querySelector("x-svg");

			// Non-sortable column
			if (x_svg_element === null) continue;

			this.#head_cells[column_index].onclick = () => {
				// toggled === true means this column is currently sorted ASC
				const direction = x_svg_element.toggled === true ? Table.#sort_directions.DESC : Table.#sort_directions.ASC;

				this.#sort = {column_index, direction};
				x_svg_element.force_toggle();

				this.#refresh();
			};
		}
	};

	#listen_to_pagination_clicks = () => {
		if (this.#pagination_elements === null) return;

		this.#pagination_elements.navigation.onclick = (event) => {
			const element = event.target.closest("[data-page]");

			if (element === null || element.classList.contains("disabled")) return;

			this.#refresh(parseInt(element.getAttribute("data-page")));
		};
	};

	#listen_to_check_changes = () => {
		if (this.#is_checkable === false) return;

		// Delegated: one listener covers every row's checkbox, drawn now or later
		this.#tbody_element.onchange = (event) => {
			const record = this.#record_by_checkbox.get(event.target);

			// Not a row checkbox, e.g. an input inside a data cell
			if (record === undefined) return;

			// The checkbox already shows the new state; this brings the Set in step with it
			if (this.#set_record_checked(record, event.target.checked) === false) return;

			this.#render_check_state();
			this.#dispatch_check_change();
		};

		// Acts on the whole view: every page, drawn or not
		this.#check_all_element.onchange = () => {
			const checked = this.#check_all_element.checked;
			let is_changed = false;

			for (const record of this.#view)
				if (this.#set_record_checked(record, checked)) is_changed = true;

			this.#render_check_state();

			if (is_changed) this.#dispatch_check_change();
		};
	};
};


window.customElements.define("x-table", Table);

window.x["Table"] = Table;
