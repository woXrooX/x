export function download_CSV(
	rows,
	file_name_and_extension = "data.csv"
) {
	const data = rows_to_CSV(rows);

	const blob = new Blob([data], {type: "text/csv;charset=utf-8;"});
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = file_name_and_extension;
	document.body.appendChild(a);
	a.click();
	a.remove();

	URL.revokeObjectURL(url);

	function rows_to_CSV(rows) {
		let CSV = '';

		for (const row of rows) {
			let first_cell = true;
			for (const cell of row) {
				if (first_cell === false) CSV += ",";
				first_cell = false;

				CSV += sanitize_cell(cell);
			}

			CSV += "\r\n";
		}

		return CSV;

		function sanitize_cell(cell_value) {
			if (cell_value == null) return '';
			const sanitized_value = String(cell_value);

			// If it contains special chars, wrap in quotes and escape quotes
			if (/[",\r\n]/.test(sanitized_value)) return `"${sanitized_value.replace(/"/g, '""')}"`;

			return sanitized_value;
		}
	}
}
