# https://docs.sendgrid.com/for-developers/sending-email/quickstart-python
# https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication
# pip install sendgrid

# from python.modules.SendGrid import SendGrid
# SendGrid.send("woXrooX@gmail.com", "My Subject", "My Content")

if __name__ != "__main__":
    from main import CONF

    class SendGrid:

        @staticmethod
        def send(from_email, to_email, content, subject = ""):
            # Check If SendGrid Is In CONF["eMail"]
            if "SendGrid" not in CONF["eMail"]: return False

            # Check If to_email Is Valid
            if not to_email: return False

            # Check If content Is Valid
            if not content: return False

            # Check If Subject Is Passed
            if not subject: subject = CONF["eMail"]["subject"]

            import sendgrid
            from sendgrid.helpers.mail import Mail, Email, To, Content

            # Load The API Key
            sg = sendgrid.SendGridAPIClient(api_key=CONF["eMail"]["SendGrid"]["api_key"])

            # From Email
            from_email = f'{from_email}@{CONF["eMail"]["SendGrid"]["domain"]}'

            message = Mail(
                from_email = from_email,
                to_emails = to_email,
                subject = subject,
                html_content = str(content)
            )

            try:
                # Load The API Key
                sg = sendgrid.SendGridAPIClient(api_key=CONF["eMail"]["SendGrid"]["api_key"])

                # Send A Send Request :)
                response = sg.send(message)

                print(response.status_code)
                print(response.body)
                print(response.headers)

                return True

            except Exception as error:
                print("SendGrid Error:", error.message)

                return False
