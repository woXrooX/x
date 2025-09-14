# NOTE: Update the dependencies page of the woXrooX.com

# https://weasyprint.org/
# pip install weasyprint

if __name__ != "__main__":
	from weasyprint import HTML

	from Python.x.modules.Globals import Globals

	class PDF:
		@staticmethod
		def generate(content, file_path_and_name_and_extension):
			if not content or not file_path_and_name_and_extension: return False

			try: HTML(
				string=content,
				base_url=Globals.PROJECT_PATH
			).write_pdf(f"{Globals.PROJECT_PATH}{file_path_and_name_and_extension}")

			except: return False

			return True
