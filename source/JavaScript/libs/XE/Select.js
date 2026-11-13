/*
	window.x.Select.build(options, attributes);

	Returns an <x-select>: a form control for picking options from a searchable list.
	Inline form: <x-select name="roles" max="3" required>[options]</x-select> (the JSON is read once, then replaced by the control)

	The inline JSON goes through the HTML parser before it gets here: escape & and < in it ("formatted_value" too), or give the options from JavaScript.
	A copy made with cloneNode() gets the markup but not the options: give it its own with set_options().

	A picked option leaves the list and shows as a chip in the control; removing the chip puts it back.
	The dropdown counts the picks against "max", or against all the options when there are fewer (2 / 8), disabled ones included.

	Submits like checked checkboxes: one entry per selected value under "name", and nothing while none is selected.

	options: [
		{
			"value": string/number (unique, compared as strings: 1 and "1" are the same option; shown as plain text without "formatted_value"),
			"formatted_value": HTML string/number (optional, wins for display and search, in the list and on the chip),
			"selected": boolean (optional, initial state, also what a form reset restores),
			"disabled": boolean (optional, the user can't change it: can't pick it while unselected, can't remove it while selected)
		}
	]

	A disabled option stays in the list, faded by Core.css's disabled rule, and the arrows skip it. Selected, its chip keeps a faded ×.
	Only the user is held back: set_values() and a form reset change it like any other option, as scripts can with native options.

	"formatted_value" is rendered as is: escape anything a user typed. Like x-table's cells, it's part of the page:
	Core.css classes, custom elements and page scripts reach it. Keep it to what's shown (flags, icons, text),
	since a click anywhere on an option picks it, and a click on a chip opens the dropdown.

	attributes: {name: value, ...} (optional, set on the new element; true sets a boolean attribute, false and null are skipped)

	Attributes:
		name: the key the values are submitted under (nothing is submitted without it)
		placeholder: text shown while nothing is selected
		max: how many options can be selected (default: no limit)
		required: the form is invalid while nothing is selected
		disabled: can't be changed and isn't submitted (a disabled <fieldset> around it does the same)

	When more options are selected than "max" allows, the first ones in option order are kept.
	The search looks at the text shown, ignoring case and accents.

	Methods:
		set_options(options) (replaces the options at any time; the selection restarts from their "selected")
		get_values() -> [value, ...] (as given in the options, in option order)
		set_values([value, ...]) (replaces the selection; values without an option are ignored)
		checkValidity(), reportValidity(), focus() (as on native form controls, names included)

	Events:
		"input" and "change" on the <x-select>, when the user changes the selection (not from the methods or a form reset)

	Keyboard, in the search: the arrows move (past disabled options), Enter picks, Escape closes

	Lang keys:
		select, type_to_search, no_data, no_matches, select_an_option

	Styling:
		Built from Core.css classes, so it follows the form styles: the control is an .input-v1, the search a text input,
		the dropdown a .surface-v1. Its own CSS is only what no class covers, added to the page once in @layer x_select.
		The element itself keeps the default inline display, as x-table does, so classes on it (display-none, s-display-none) work;
		display-block gives it a box for a width or margins.
*/


export default class Select extends HTMLElement {
	/////////////////////////// Static

	/////////// Variables

	// Makes it a form control: the browser gives it a form owner, labels, validation and the form...Callback methods
	static formAssociated = true;

	// "disabled" isn't listed: the browser reports it through formDisabledCallback
	static observedAttributes = ["name", "placeholder", "max", "required"];

	// Only ever increments, so every instance gets an anchor name of its own
	static #last_ID = 0;

	static #template = document.createElement("template");
	static #option_template = document.createElement("template");
	static #chip_template = document.createElement("template");

	// What no Core.css class covers, added to the page once
	static #style_sheet = new CSSStyleSheet();

	// One highlight for all instances; each instance adds and removes only its own ranges
	static #search_highlight = new Highlight();


	//// Static initialization blocks

	static {
		/*
			The trigger is the box on the page. The chips are inside it, so a click anywhere on the control opens the dropdown;
			everything in it is phrasing content (spans, svg), as a <button> requires.
		*/
		Select.#template.innerHTML = `
			<button class="trigger input-v1 width-100 padding-y-1 gap-0-5 text-align-start" type="button">
				<span class="placeholder flex-grow-1 text-color-secondary white-space-nowrap overflow-hidden text-overflow-ellipsis"></span>
				<span class="chips display-flex flex-row flex-wrap flex-grow-1 gap-0-2"></span>
				<svg class="chevron flex-shrink-0 text-color-secondary" viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
			</button>

			<div class="dropdown surface-v1 border-style-solid border-width-1px border-color-4 padding-1 text-color-primary text-size-0-9em" popover>
				<div class="display-flex flex-row align-items-center gap-0-5 margin-bottom-1">
					<input class="cursor-text" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done">
					<span class="counter flex-shrink-0 text-color-secondary text-size-0-8em white-space-nowrap font-variant-numeric-tabular-nums" dir="ltr"></span>
				</div>

				<div class="options scrollbar-y overscroll-behavior-contain max-height-300px"></div>
				<div class="empty padding-2 text-color-secondary text-align-center" hidden></div>
			</div>
		`;

		Select.#option_template.innerHTML = `
			<div class="option cursor-pointer padding-1-5 padding-x-2 radius-default user-select-none"></div>
		`;

		Select.#chip_template.innerHTML = `
			<span class="chip display-flex flex-row align-items-center gap-0-1 max-width-100 padding-left-2 radius-default bg-6 text-size-0-8em">
				<span class="chip_label white-space-nowrap overflow-hidden text-overflow-ellipsis"></span>
				<span class="chip_remove display-grid place-items-center flex-shrink-0 padding-1 radius-circle on-hover-bg-7">
					<svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
				</span>
			</span>
		`;

		/*
			A layer of its own, after Core.css: it wins over Core's classes where both apply, and plain page CSS still wins over it.
			Nothing in it styles the element itself: a rule here would win over the classes put on it (display-none and the like).
			The tokens have fallbacks, so the dropdown is still placed right without Core.css.
		*/
		Select.#style_sheet.replaceSync(`
			@layer x_select {
				x-select > .dropdown {
					max-width: min(30em, calc(100vw - 1em));

					/* Centered in the viewport, where anchor positioning isn't supported */
					margin: auto;
				}

				@supports (anchor-name: --a) {
					x-select > .dropdown {
						position-area: block-end span-inline-end;

						/* No room below: above. No room towards the end: aligned to the control's other edge. */
						position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;

						inset: auto;
						margin: var(--margin, 0.25rem) 0;
						min-width: anchor-size(width);
					}
				}

				x-select > .trigger > .chevron { transition: rotate var(--transition-velocity, 200ms) ease-in-out; }

				x-select:has(> .dropdown:popover-open) > .trigger > .chevron { rotate: 180deg; }

				/* A finger needs a taller row than a mouse pointer */
				@media (pointer: coarse) {
					x-select > .dropdown > .options > .option { padding-block: calc(var(--padding, 0.25rem) * 2.5); }
				}

				::highlight(x_select_search) {
					background-color: var(--color-error, Mark);
					color: var(--color-white, MarkText);
				}
			}
		`);

		document.adoptedStyleSheets.push(Select.#style_sheet);
		CSS.highlights.set("x_select_search", Select.#search_highlight);
	}


	/////////// APIs

	static build(options, attributes = null) {
		const select = document.createElement("x-select");

		for (const [name, value] of Object.entries(attributes ?? {})) {
			if (value === true) select.setAttribute(name, '');
			else if (value !== false && value !== null && value !== undefined) select.setAttribute(name, value);
		}

		select.set_options(options);

		return select;
	}


	/////////// Helpers

	// A value is a non-empty string or a finite number, kept as a string
	static #normalize_value(value) {
		if (typeof(value) === "number" && Number.isFinite(value)) return String(value);
		if (typeof(value) === "string" && value !== '') return value;

		throw new TypeError("Select: \"value\" must be a non-empty string or a finite number.");
	}

	// "formatted_value" wins for display, as HTML; without it the value shows as plain text
	static #render_display(element, record) {
		if (record.formatted_value === null) element.textContent = record.key;
		else element.innerHTML = record.formatted_value;
	}

	// A missing or invalid "max" means no limit
	static #parse_max(value) {
		const max = parseInt(value);

		if (Number.isNaN(max) || max < 1) return Infinity;

		return max;
	}

	// Lowercase and without accents, one character for one character, so a match sits at the same position in the text shown
	static #fold(text) {
		let folded = '';

		for (const character of text) {
			// NFD splits "é" into "e" and its accent, \p{M} matches the accent
			const plain = character.normalize("NFD").replace(/\p{M}/gu, '').toLowerCase();

			// A character that would change length is kept as it is, or every position after it would shift
			folded += plain.length === character.length ? plain : character;
		}

		return folded;
	}


	/////////////////////////// Object

	/////////// Variables

	#ID = 0;
	#internals = null;

	// The markup is built once, when first needed: on connection, or when options are given before that
	#is_built = false;

	#trigger_element = null;
	#placeholder_element = null;
	#chips_element = null;
	#dropdown_element = null;
	#search_element = null;
	#counter_element = null;
	#options_element = null;
	#empty_element = null;

	// Master data, in option order: {key, value, formatted_value, search_text, is_default, is_disabled, element}
	#records = [];

	// Option element or chip remove element -> record, for the delegated listeners
	#record_by_element = new WeakMap();

	// Keys of the selected options. This is the truth; the DOM and the form value only reflect it.
	#selected_keys = new Set();

	#max = Infinity;

	// The options the list shows: not selected and matching the search, in option order
	#view = [];

	// The option the keyboard acts on
	#active_record = null;

	// This instance's ranges inside the shared highlight
	#highlight_ranges = [];


	/////////// APIs

	constructor() {
		super();

		Select.#last_ID += 1;
		this.#ID = Select.#last_ID;

		// The element's side of the form: value and validity
		this.#internals = this.attachInternals();
	}

	connectedCallback() {
		if (this.#is_built) return;

		// While the page is still being parsed, an element can be connected before its content exists
		if (document.readyState === "loading")
			document.addEventListener("DOMContentLoaded", () => this.#init(), {once: true});
		else this.#init();
	}

	disconnectedCallback() {
		// The browser closes the dropdown itself; only the shared highlight has to let go of this instance
		this.#clear_highlights();
	}

	attributeChangedCallback(attribute_name, old_value, new_value) {
		if (attribute_name === "max") {
			this.#max = Select.#parse_max(new_value);

			// A lower limit drops the selected options that no longer fit. A copy, because #select() empties the set first.
			this.#select(new Set(this.#selected_keys));
			return;
		}

		// The other attributes are read while rendering
		this.#render();
	}

	// Called by the browser on form.reset()
	formResetCallback() {
		this.#select_defaults();
	}

	// Called by the browser for the element's own "disabled" attribute and for a disabled <fieldset> around it
	formDisabledCallback(is_disabled) {
		if (this.#is_built === false) return;

		/*
			"inert", not "disabled": Core.css already fades the whole element, and a disabled button inside would fade twice.
			Inert also puts the chips, which are in the trigger, out of reach.
		*/
		this.#trigger_element.inert = is_disabled;

		if (is_disabled) this.#close();
	}

	set_options(options) {
		if (!Array.isArray(options))
			throw new TypeError("Select: options must be an array like [{\"value\": 1, \"formatted_value\": \"One\"}].");

		const records = [];
		const keys = new Set();

		// Everything is validated before anything changes, so a bad list leaves the element as it was
		for (const option of options) {
			if (option === null || typeof(option) !== "object" || Array.isArray(option))
				throw new TypeError("Select: every option must be an object like {\"value\": 1, \"formatted_value\": \"One\"}.");

			if ("selected" in option && typeof(option["selected"]) !== "boolean")
				throw new TypeError("Select: option \"selected\" must be a boolean.");

			if ("disabled" in option && typeof(option["disabled"]) !== "boolean")
				throw new TypeError("Select: option \"disabled\" must be a boolean.");

			const formatted_value = option["formatted_value"];

			if (formatted_value !== undefined && typeof(formatted_value) !== "string" && typeof(formatted_value) !== "number")
				throw new TypeError("Select: option \"formatted_value\" must be an HTML string or a number.");

			const key = Select.#normalize_value(option["value"]);

			if (keys.has(key)) throw new Error(`Select: duplicate option value "${key}".`);

			keys.add(key);

			records.push({
				key,
				value: option["value"],
				formatted_value: formatted_value === undefined ? null : String(formatted_value),
				search_text: null,
				is_default: option["selected"] === true,
				is_disabled: option["disabled"] === true,
				element: null
			});
		}

		// Options given from code win over the inline JSON: building the markup replaces it
		if (this.#is_built === false) this.#build_DOM();

		// A fragment, so the options reach the DOM in one operation
		const fragment = document.createDocumentFragment();

		for (const record of records) fragment.append(this.#create_option_element(record));

		this.#records = records;
		this.#options_element.replaceChildren(fragment);

		this.#select_defaults();

		// New options: the list starts over from the top
		this.#apply_search();
	}

	get_values() {
		const values = [];

		for (const record of this.#records)
			if (this.#selected_keys.has(record.key)) values.push(record.value);

		return values;
	}

	set_values(values) {
		if (!Array.isArray(values)) throw new TypeError("Select: values must be an array.");

		const keys = new Set();

		for (const value of values) keys.add(Select.#normalize_value(value));

		this.#select(keys);
	}

	// As on native form controls: focusing the element focuses its trigger
	focus(options) {
		this.#trigger_element?.focus(options);
	}

	// Named as on native form controls, so code that validates fields one by one treats this one the same
	checkValidity() {
		return this.#internals.checkValidity();
	}

	reportValidity() {
		return this.#internals.reportValidity();
	}


	/////////// Helpers

	//// Markup

	// Reads the inline JSON and builds the markup in its place. Runs once.
	#init() {
		if (this.#is_built) return;

		// A copy of a built x-select starts with its markup instead of JSON
		const is_copy = this.querySelector(":scope > .trigger") !== null;
		const has_elements = this.childElementCount > 0;
		const text = this.textContent.trim();

		// Built first, so the control is complete even when the JSON turns out to be invalid
		this.#build_DOM();

		if (is_copy || text === '') return;

		// The HTML parser has already made elements of unescaped HTML, which the JSON's text has lost
		if (has_elements) throw new TypeError("Select: the inline JSON has unescaped HTML in it: escape & and <, or give the options from JavaScript.");

		let options;

		try { options = JSON.parse(text); }
		catch (error) { throw new TypeError("Select: content is not valid JSON.", {cause: error}); }

		this.set_options(options);
	}

	#build_DOM() {
		// Whatever was inside, the inline JSON, is replaced
		this.replaceChildren(Select.#template.content.cloneNode(true));

		this.#trigger_element = this.querySelector(":scope > .trigger");
		this.#placeholder_element = this.#trigger_element.querySelector(".placeholder");
		this.#chips_element = this.#trigger_element.querySelector(".chips");
		this.#dropdown_element = this.querySelector(":scope > .dropdown");
		this.#search_element = this.#dropdown_element.querySelector("input");
		this.#counter_element = this.#dropdown_element.querySelector(".counter");
		this.#options_element = this.#dropdown_element.querySelector(".options");
		this.#empty_element = this.#dropdown_element.querySelector(".empty");

		/*
			Ids and anchor names are page-wide, so instances would collide on them.
			The dropdown is given to the trigger as a reference instead of an id, and the anchor name is made unique.
		*/
		this.#trigger_element.popoverTargetElement = this.#dropdown_element;
		this.#trigger_element.style.setProperty("anchor-name", `--x_select_${this.#ID}`);
		this.#dropdown_element.style.setProperty("position-anchor", `--x_select_${this.#ID}`);

		this.#search_element.placeholder = window.Lang.use("type_to_search");

		// "inert", for the reasons in formDisabledCallback
		this.#trigger_element.inert = this.matches(":disabled");

		this.#listen_to_host();
		this.#listen_to_chips();
		this.#listen_to_dropdown();
		this.#listen_to_search();
		this.#listen_to_options();

		this.#is_built = true;

		this.#render();
	}

	#create_option_element(record) {
		const element = Select.#option_template.content.firstElementChild.cloneNode(true);

		Select.#render_display(element, record);

		// Core.css's disabled rule fades it and keeps the pointer off it; the code never picks it for the user either
		if (record.is_disabled) element.classList.add("disabled");

		record.element = element;

		// The search looks at the text shown, whatever HTML is around it
		record.search_text = Select.#fold(element.textContent);

		this.#record_by_element.set(element, record);

		return element;
	}


	//// Selection

	// Replaces the selection. Unknown keys are ignored, and option order decides which ones fit under "max".
	#select(keys) {
		this.#selected_keys.clear();

		for (const record of this.#records) {
			if (this.#selected_keys.size >= this.#max) break;
			if (keys.has(record.key)) this.#selected_keys.add(record.key);
		}

		this.#render();
	}

	#select_defaults() {
		const keys = new Set();

		for (const record of this.#records)
			if (record.is_default) keys.add(record.key);

		this.#select(keys);
	}

	// A pick from the list, or a chip removed. The only place that fires events, like a native control.
	#toggle(record) {
		// Neither a disabled control nor a disabled option changes, even for a click dispatched from code
		if (this.matches(":disabled") || record.is_disabled) return;

		const is_selected = this.#selected_keys.has(record.key);

		// At the limit nothing can be added
		if (is_selected === false && this.#selected_keys.size >= this.#max) return;

		if (is_selected) this.#selected_keys.delete(record.key);
		else this.#selected_keys.add(record.key);

		this.#render();

		// As a native control's: "input" is composed, "change" isn't
		this.dispatchEvent(new Event("input", {bubbles: true, composed: true}));
		this.dispatchEvent(new Event("change", {bubbles: true}));
	}


	//// Render

	/*
		The single path after every change: selection, options or attributes.
		Everything shown, and everything the form gets, is derived here from #selected_keys.
	*/
	#render() {
		const selected_records = this.#records.filter((record) => this.#selected_keys.has(record.key));

		// Before the markup exists there's nothing to show, but the form already gets its value and validity
		if (this.#is_built) {
			this.#render_list();
			this.#render_control(selected_records);
		}

		this.#sync_form(selected_records);
	}

	/*
		The list shows the options that are neither selected nor filtered out by the search, disabled ones included.
		The keyboard position stays put: when its option is picked, the option that takes its place becomes active.
	*/
	#render_list() {
		// NFC first: an "e" typed or pasted with a separate accent becomes one "é", which then folds like the text shown does
		const term = Select.#fold(this.#search_element.value.trim().normalize("NFC"));
		const active_index = this.#view.indexOf(this.#active_record);

		// At the limit, the options left are shown dimmed and can't be picked
		const is_full = this.#selected_keys.size >= this.#max;

		this.#clear_highlights();
		this.#view = [];

		for (const record of this.#records) {
			// A selected option is out of the list. An empty term is found at 0 in every text, so it filters nothing out.
			const index = this.#selected_keys.has(record.key) ? -1 : record.search_text.indexOf(term);

			record.element.hidden = index === -1;

			// On each option rather than on the list, so a disabled one, which the pointer passes through, doesn't show a hand
			record.element.classList.toggle("cursor-not-allowed", is_full);

			if (index === -1) continue;

			this.#view.push(record);

			if (term !== '') this.#add_highlight(record.element, index, index + term.length);
		}

		this.#options_element.classList.toggle("opacity-0-5", is_full);

		// Empty: everything is picked (or there are no options), or nothing matches the search
		this.#empty_element.hidden = this.#view.length > 0;
		this.#empty_element.textContent = window.Lang.use(term === '' ? "no_data" : "no_matches");

		// The active option left the list: the nearest one the user can pick takes over, from its place down, then up
		if (this.#view.includes(this.#active_record) === false) {
			const index = Math.min(Math.max(active_index, 0), this.#view.length - 1);

			this.#set_active(this.#pickable_from(index, 1) ?? this.#pickable_from(index - 1, -1));
		}
	}

	#render_control(selected_records) {
		const has_chips = selected_records.length > 0;

		this.#placeholder_element.textContent = this.getAttribute("placeholder") ?? window.Lang.use("select");
		this.#placeholder_element.hidden = has_chips;

		this.#chips_element.replaceChildren(...selected_records.map((record) => this.#create_chip_element(record)));

		// A class, not "hidden": the chips' display-flex class would win over the attribute
		this.#chips_element.classList.toggle("display-none", has_chips === false);

		// Picked, out of "max", or out of all the options when there are fewer, disabled ones included (no "max" is Infinity)
		this.#counter_element.textContent = `${selected_records.length} / ${Math.min(this.#max, this.#records.length)}`;
	}

	#create_chip_element(record) {
		const element = Select.#chip_template.content.firstElementChild.cloneNode(true);

		// Both found before the label gets its HTML, which could hold anything
		const label_element = element.querySelector(".chip_label");
		const remove_element = element.querySelector(".chip_remove");

		Select.#render_display(label_element, record);

		// A disabled option's chip can't be removed: its × stays, faded like anything disabled, and isn't wired up
		if (record.is_disabled) remove_element.classList.add("disabled");
		else this.#record_by_element.set(remove_element, record);

		return element;
	}

	#sync_form(selected_records) {
		const name = this.getAttribute("name");
		let form_data = null;

		// FormData, because one name carries many values. null submits nothing at all, like unchecked checkboxes.
		if (name !== null && name !== '' && selected_records.length > 0) {
			form_data = new FormData();

			for (const record of selected_records) form_data.append(name, record.key);
		}

		this.#internals.setFormValue(form_data);

		// The third argument is where the browser shows its validation message
		if (this.hasAttribute("required") && selected_records.length === 0)
			this.#internals.setValidity({valueMissing: true}, window.Lang.use("select_an_option"), this.#trigger_element ?? undefined);
		else this.#internals.setValidity({});
	}


	//// Search

	// A new search starts the list over: scrolled to the top, its first option the user can pick active
	#apply_search() {
		this.#render_list();

		this.#options_element.scrollTop = 0;
		this.#set_active(this.#pickable_from(0, 1));
	}

	/*
		A highlight paints a range of text without touching the DOM.
		"start" and "end" are positions in the element's textContent, which is its text nodes one after another,
		so they're found node by node. A match can run across nodes: "amm" in <b>Gam</b>ma.
	*/
	#add_highlight(element, start, end) {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		let start_node = null;
		let start_offset = 0;
		let node_start = 0;

		while (walker.nextNode()) {
			const node = walker.currentNode;
			const node_end = node_start + node.length;

			if (start_node === null && start < node_end) {
				start_node = node;
				start_offset = start - node_start;
			}

			if (start_node !== null && end <= node_end) {
				const range = new StaticRange({startContainer: start_node, startOffset: start_offset, endContainer: node, endOffset: end - node_start});

				this.#highlight_ranges.push(range);
				Select.#search_highlight.add(range);
				return;
			}

			node_start = node_end;
		}
	}

	#clear_highlights() {
		for (const range of this.#highlight_ranges) Select.#search_highlight.delete(range);

		this.#highlight_ranges = [];
	}


	//// Active option

	// Marked with Core.css's bg-4, the tint for it
	#set_active(record, is_scrolled_into_view = false) {
		this.#active_record?.element.classList.remove("bg-4");

		this.#active_record = record;

		if (record === null) return;

		record.element.classList.add("bg-4");

		if (is_scrolled_into_view) record.element.scrollIntoView({block: "nearest"});
	}

	// Moves through the options the user can pick, skipping disabled ones and wrapping around both ends
	#move_active(step) {
		const index = this.#view.indexOf(this.#active_record);
		const other_end = step > 0 ? 0 : this.#view.length - 1;
		const record = this.#pickable_from(index + step, step) ?? this.#pickable_from(other_end, step);

		if (record !== null) this.#set_active(record, true);
	}

	// The first option the user can pick in the list, from "index" on, going down (step 1) or up (step -1). null if there's none.
	#pickable_from(index, step) {
		for (let position = index; position >= 0 && position < this.#view.length; position += step)
			if (this.#view[position].is_disabled === false) return this.#view[position];

		return null;
	}


	//// Dropdown

	#is_open() {
		return this.#dropdown_element.matches(":popover-open");
	}

	#close() {
		if (this.#is_open()) this.#dropdown_element.hidePopover();
	}


	//// Listeners

	/*
		The record of the option, or of the chip's remove button, that an event happened in.
		Found by walking up rather than by a class, so the HTML of a "formatted_value" can't be mistaken for one.
	*/
	#record_at(node) {
		for (let element = node; element !== null && element !== this; element = element.parentElement) {
			const record = this.#record_by_element.get(element);

			if (record !== undefined) return record;
		}

		return undefined;
	}

	#listen_to_host() {
		// A <label> click arrives as a click on the element itself: the trigger takes the focus, as a native control would
		this.addEventListener("click", (event) => {
			if (event.target === this) this.#trigger_element.focus();
		});

		/*
			The popover already closes on a click outside and on Escape, but not when the focus moves to another field,
			as the previous/next buttons above a phone's keyboard do.
			A null relatedTarget is left alone: it is the window losing focus, which shouldn't close anything,
			or a click on something that can't be focused, which is a click outside.
		*/
		this.addEventListener("focusout", (event) => {
			if (event.relatedTarget === null || this.contains(event.relatedTarget)) return;

			this.#close();
		});

		/*
			While the dropdown is open, the focus stays in the search. A press on anything else in the element
			(an option, a chip, the counter, the space between) would take it, and typing and the arrows would stop working.
		*/
		this.addEventListener("mousedown", (event) => {
			if (this.#is_open() && event.target !== this.#search_element) event.preventDefault();
		});
	}

	#listen_to_chips() {
		this.#chips_element.addEventListener("click", (event) => {
			const record = this.#record_at(event.target);

			// Anywhere else on a chip, the click goes on to the trigger and opens the dropdown
			if (record === undefined) return;

			// The chips are inside the trigger: canceling the click keeps it from toggling the dropdown
			event.preventDefault();

			this.#toggle(record);
		});
	}

	#listen_to_dropdown() {
		this.#dropdown_element.addEventListener("beforetoggle", (event) => {
			/*
				Every opening starts clean: empty search, all options, list at the top.
				Done both ways. While closing, the list is still rendered, so its scroll can be reset.
				While opening, it covers a dropdown that left the page while open and never got to close.
			*/
			this.#search_element.value = '';
			this.#apply_search();

			/*
				A popover focuses its autofocus element as it opens, so the search is ready to type in.
				Not on a touch screen, where that would raise the keyboard over the list before anyone asked to search.
			*/
			this.#search_element.autofocus = event.newState === "open" && window.matchMedia("(pointer: fine)").matches;
		});
	}

	#listen_to_search() {
		// The search's own "input" and "change" bubble to the page's form, where they'd look like a change of value
		this.#search_element.addEventListener("input", (event) => {
			event.stopPropagation();

			this.#apply_search();
		});

		this.#search_element.addEventListener("change", (event) => event.stopPropagation());

		this.#search_element.addEventListener("keydown", (event) => {
			// Keys that belong to an input method composing a character
			if (event.isComposing) return;

			switch (event.key) {
				case "ArrowDown":
					event.preventDefault();
					this.#move_active(1);
					break;

				case "ArrowUp":
					event.preventDefault();
					this.#move_active(-1);
					break;

				case "Enter":
					// Enter must never submit the form from here
					event.preventDefault();

					if (this.#active_record === null) break;

					this.#toggle(this.#active_record);

					// Selected, so typing the next search replaces this one
					this.#search_element.select();
					break;
			}
		});
	}

	#listen_to_options() {
		// Delegated: one listener covers every option, whenever it was added
		this.#options_element.addEventListener("click", (event) => {
			const record = this.#record_at(event.target);

			if (record !== undefined) this.#toggle(record);
		});

		// pointermove, not mouseover: a list scrolling under a resting pointer must not move the active option
		this.#options_element.addEventListener("pointermove", (event) => {
			const record = this.#record_at(event.target);

			if (record !== undefined && record !== this.#active_record && record.is_disabled === false) this.#set_active(record);
		});
	}
};


window.customElements.define("x-select", Select);

window.x["Select"] = Select;
