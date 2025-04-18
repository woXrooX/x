# options = {
#     'page-size': 'Letter',
#     'margin-top': '0.75in',
#     'margin-right': '0.75in',
#     'margin-bottom': '0.75in',
#     'margin-left': '0.75in',
#     'encoding': "UTF-8",
#     'custom-header': [
#         ('Accept-Encoding', 'gzip')
#     ],
#     'cookie': [
#         ('cookie-empty-value', '""')
#         ('cookie-name1', 'cookie-value1'),
#         ('cookie-name2', 'cookie-value2'),
#     ],
#     'no-outline': None
# }

# https://pypi.org/project/pdfkit/
# pip install pdfkit
# sudo apt-get install wkhtmltopdf

if __name__ != "__main__":
	import pdfkit

	class PDF:
		@staticmethod
		def generate(content, path_to_save, file_name_to_save, options = {}):
			# Check For Invalid Arguments
			if not content or not path_to_save or not file_name_to_save: return False

			file_path_and_name = f"{path_to_save}/{file_name_to_save}.pdf"

			# Returns True If Creation Successful Else False
			return pdfkit.from_string(content, file_path_and_name, options=options)
