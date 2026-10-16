export function download_canvas_as_file({
	canvas_element,
	file_name_and_extension = "image.png",

	// image/png
	// image/jpeg
	// image/webp
	type = "image/png",

	// a number from 0 to 1 that only affects lossy formats (JPEG, WebP). PNG ignores it.
	quality = undefined
}) {
	return new Promise((resolve, reject) => {
		canvas_element.toBlob(blob => {
			if (blob === null) return reject(new Error("Canvas could not be encoded."));

			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = file_name_and_extension;
			document.body.appendChild(a);
			a.click();
			a.remove();

			URL.revokeObjectURL(url);
			resolve(blob.type);
		}, type, quality);
	});
}
