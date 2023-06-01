# https://pypi.org/project/pdfkit/
# pip install pdfkit
# sudo apt-get install wkhtmltopdf

if __name__ != "__main__":
    import pdfkit

    class PDF:
        @staticmethod
        def generate(content, pathToSave, fileNameToSave):
            # Returns True If Creation Successful Else False
            return pdfkit.from_string(content, f"{pathToSave}/{fileNameToSave}.pdf")        