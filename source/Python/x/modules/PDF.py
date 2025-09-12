# https://weasyprint.org/
# pip install weasyprint

if __name__ != "__main__":
	from weasyprint import HTML
	from Python.x.modules.Globals import Globals

	class PDF:
		@staticmethod
		def generate(content, path_to_save, file_name_to_save, base_url=Globals.PROJECT_PATH):
			# Check For Invalid Arguments
			if not content or not path_to_save or not file_name_to_save: return False

			file_path_and_name = f"{path_to_save}/{file_name_to_save}.pdf"

			try: HTML(string=content, base_url=base_url).write_pdf(file_path_and_name)
			except: return False

			return True
