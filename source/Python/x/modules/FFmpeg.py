# macOS: brew install ffmpeg
# Ubuntu sudo apt install ffmpeg -y

if __name__ != "__main__":
	import subprocess
	import pathlib

	from Python.x.modules.Logger import Log

	class FFmpeg:
		@staticmethod
		def remux(input_path_and_file):
			input_path_and_file = pathlib.Path(input_path_and_file)

			# Check if input exists
			if not input_path_and_file.is_file():
				Log.error(f"FFmpeg.remux(): input does not exist: {input_path_and_file}")

				return False

			# Build output in same directory: original_name + "_modified" + extension
			output_path_and_file = input_path_and_file.with_name(f"{input_path_and_file.stem}_modified{input_path_and_file.suffix}")

			#### ffmpeg -hide_banner -loglevel error -n -i "input_path_and_file" -c copy "output_path_and_file"
			# -hide_banner – hides the FFmpeg version/config info.
			# -loglevel error – only show error messages (no warnings/info).
			# -y – automatically overwrite the output file if it exists.
			# -i "input..." – specifies the input file.
			# -c copy – stream copy: no re-encoding, just copies audio/video/subtitles as-is.
			# "output..." – where to save the result.
			cmd = [
				"ffmpeg",
				"-hide_banner",
				"-loglevel", "error",
				"-n",
				"-i", str(input_path_and_file),
				"-c", "copy",
				str(output_path_and_file),
			]

			try: result = subprocess.run(cmd, capture_output=True, text=True)

			except Exception as err:
				Log.error(f"FFmpeg.remux(): {err}")

				return False

			if result.returncode != 0:
				Log.error(f"FFmpeg.remux(): {input_path_and_file} -> {output_path_and_file}")
				Log.error(f"{result.stderr}")

				return False

			return output_path_and_file
