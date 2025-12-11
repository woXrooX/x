///////// woXrooX Flavored Markdown

export default function Markdown_to_HTML(markdown) {
	if(typeof markdown !== 'string') return '';

	let HTML = markdown;

	// Preserve <br> tags by replacing them with a placeholder
	HTML = HTML.replace(/<br>/gi, '%%BR%%');

	// Escape special characters (only once)
	HTML = HTML.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

	// Restore <br> tags
	HTML = HTML.replace(/%%BR%%/g, '<br>');

	// Process headers
	HTML = HTML.replace(/^(#{1,6})\s+(.*)$/gm, function(match, hashes, content) {
		return `<h${hashes.length}>${content.trim()}</h${hashes.length}>`;
	});

	HTML = process_bold_and_italic(HTML);

	// Process images !file:image[alt_text](/path/to/image.jpg) - must come BEFORE links to avoid conflict
	HTML = HTML.replace(/!file:image\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

	// Process links [text](url)
	HTML = HTML.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

	HTML = process_lists(HTML);

	// Process blocks
	return process_blocks(HTML);
}



///////// Helpers

function process_bold_and_italic(HTML){
	let output = HTML;

	// First handle combined bold+italic
	output = output.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");

	// Then handle remaining bold
	output = output.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

	// Finally handle remaining italic
	output = output.replace(/\*(.*?)\*/g, "<em>$1</em>");

	return output;
}

function process_lists(HTML) {
	const lines = HTML.split('\n');
	let output = [];
	let list_stack = [];
	let current_level = -1;
	let number_counters = {};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Empty line - close all open lists (keeping original behavior)
		if (!trimmed) {
			while (list_stack.length > 0) {
				const last_list = list_stack.pop();
				output.push(`</${last_list.type}>`);
			}

			current_level = -1;
			output.push(line);
			continue;
		}

		const leading_tabs = (line.match(/^\t*/)[0] || '').length;
		const level = leading_tabs;
		const ordered_match = trimmed.match(/^\d+\.[\s\t]+\S/);
		const unordered_match = trimmed.match(/^-[\s\t]+\S/);

		if (ordered_match || unordered_match) {
			const is_ordered = !!ordered_match;
			const content = trimmed.replace(is_ordered ? /^\d+\.[\s\t]+/ : /^-[\s\t]+/,'');

			// Handle level skipping
			if (level > current_level + 1) {
				// Insert intermediate levels
				for (let l = current_level + 1; l < level; l++) {
					const intermediate_type = is_ordered ? 'ol' : 'ul';
					list_stack.push({ type: intermediate_type, level: l });
					output.push(`<${intermediate_type}>`);
				}
			}

			if (level > current_level) {
				const list_type = is_ordered ? 'ol' : 'ul';
				list_stack.push({ type: list_type, level });
				output.push(`<${list_type}>`);
				current_level = level;
			}

			else if (level < current_level) {
				while (current_level > level && list_stack.length > 0) {
					const last_list = list_stack.pop();
					output.push(`</${last_list.type}>`);
					current_level--;
				}
			}

			// Handle list type switching at same level
			if (level === current_level && list_stack.length > 0) {
				const current_list = list_stack[list_stack.length - 1];
				const new_type = is_ordered ? 'ol' : 'ul';

				if (current_list.type !== new_type) {
					list_stack.pop();
					output.push(`</${current_list.type}>`);
					list_stack.push({ type: new_type, level });
					output.push(`<${new_type}>`);
				}
			}

			output.push(`<li>${content}</li>`);
		}

		else {
			// Non-list line - close all open lists
			while (list_stack.length > 0) {
				const last_list = list_stack.pop();
				output.push(`</${last_list.type}>`);
			}

			current_level = -1;
			output.push(line);
		}
	}

	// Close any remaining lists
	while (list_stack.length > 0) {
		const last_list = list_stack.pop();
		output.push(`</${last_list.type}>`);
	}

	return output.join('\n');
}

// Split into blocks and handle empty lines
function process_blocks(HTML) {
	let output = '';
	const blocks = HTML.split('\n');
	let current_paragraph = [];

	for (let i = 0; i < blocks.length; i++) {
		const trimmed_block = blocks[i].trim();

		// Skip wrapping if the line contains HTML tags for headers or lists
		if (
			trimmed_block.startsWith('<h') ||
			trimmed_block.startsWith('<ul') ||
			trimmed_block.startsWith('</ul') ||
			trimmed_block.startsWith('<ol') ||
			trimmed_block.startsWith('</ol') ||
			trimmed_block.startsWith('<li') ||
			trimmed_block.startsWith('</li')
		) {

			// If we have accumulated paragraph content, flush it first
			if (current_paragraph.length > 0) {
				output += `<p>${current_paragraph.join(' ')}</p>`;
				current_paragraph = [];
			}

			output += trimmed_block;
		}
		else if (!trimmed_block) {
			// Empty line - flush current paragraph if exists
			if (current_paragraph.length > 0) {
				output += `<p>${current_paragraph.join(' ')}</p>`;
				current_paragraph = [];
			}
		}
		else {
			// Non-empty line - add to current paragraph
			current_paragraph.push(trimmed_block);
		}
	}

	// Don't forget to flush any remaining paragraph content
	if (current_paragraph.length > 0) {
		output += `<p>${current_paragraph.join(' ')}</p>`;
	}

	return output;
}



///////// Export to global scope
if (typeof window !== 'undefined') window.Markdown_to_HTML = Markdown_to_HTML;
