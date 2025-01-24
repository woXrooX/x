if __name__ != "__main__":
	from Python.x.modules.Logger import Log

	# Identifies file size from the "request.files" in Flask
	def file_size_from_multipart_form_data(file_object):
		try:
			file_object.seek(0, 2)
			file_size = file_object.tell()
			file_object.seek(0, 0)
			return file_size

		except Exception as e:
			Log.error(f"Files.file_size_from_request(): Could not identify the file size: {e}")
			return False
