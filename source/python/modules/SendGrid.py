# https://docs.sendgrid.com/for-developers/sending-email/quickstart-python
# https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication
# pip install sendgrid

# from python.modules.SendGrid import SendGrid
# SendGrid.send("woXrooX@gmail.com", "My Subject", "My Content")

if __name__ != "__main__":
	from python.modules.Globals import Globals
	from python.modules.Logger import Log

	class SendGrid:

		# Returns True on success else False
		@staticmethod
		def send(from_email, to_email, content, subject = ""):
			# Check If SendGrid Is Enabled
			if "enabled" in Globals.CONF["eMail"]["SendGrid"] and Globals.CONF["eMail"]["SendGrid"]["enabled"] is False:
				Log.warning(f"SendGrid.send(): SendGrid is not enabled")
				return False

			# Check If to_email Is Valid
			if not to_email: return False

			# Check If content Is Valid
			if not content: return False

			# Check If Subject Is Passed
			if not subject: subject = Globals.CONF["eMail"]["subject"]

			import sendgrid
			from sendgrid.helpers.mail import Mail, Email, To, Content

			# Load The API Key
			sg = sendgrid.SendGridAPIClient(api_key=Globals.CONF["eMail"]["SendGrid"]["api_key"])

			# From Email
			from_email = f'{from_email}@{Globals.CONF["eMail"]["SendGrid"]["domain"]}'

			email_html = f"""
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>{Globals.CONF["default"]["title"]}</title>
				</head>
				<body style="width:100%; padding:10px;">
					<header style="text-aligment:center; color: white; padding:5px; background-color:hsl({Globals.CONF["default"]["color"]["brand"]["hue"]}deg, {Globals.CONF["default"]["color"]["brand"]["saturation"]}%, {Globals.CONF["default"]["color"]["brand"]["lightness"]}%); width:100%;">
					{Globals.CONF["default"]["title"]}
					</header>
					<main>{content}</main>
					<footer></footer>
				</body>
				</html>
			"""

			message = Mail(
				from_email = from_email,
				to_emails = to_email,
				subject = subject,
				html_content = str(email_html)
			)

			try:
				# Load The API Key
				sg = sendgrid.SendGridAPIClient(api_key=Globals.CONF["eMail"]["SendGrid"]["api_key"])

				# Send A Send Request :)
				response = sg.send(message)

				Log.fieldset(
					f"{response.status_code}\n{response.body}\n{response.headers}",
					legend="SendGrid.send()",
					type="success"
				)

				return True

			except Exception as error:
				Log.error(f"SendGrid.send(): {error}")

				return False
