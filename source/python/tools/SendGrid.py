# https://docs.sendgrid.com/for-developers/sending-email/quickstart-python
# https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication
# pip install sendgrid

# from python.tools.SendGrid import SendGrid
# SendGrid.send("woXrooX@gmail.com", "My Subject", "My Content")

if __name__ != "__main__":
    from __main__ import CONF

    import sendgrid
    from sendgrid.helpers.mail import Mail, Email, To, Content

    class SendGrid:

        @staticmethod
        def send(to_email, subject, content):
            # Check If SendGrid Is In CONF["eMail"]
            if "SendGrid" not in CONF["eMail"]: return False;

            # Load The API Key
            sg = sendgrid.SendGridAPIClient(api_key=CONF["eMail"]["SendGrid"]["api_key"])

            mail = Mail(
                Email("woXrooX@gmail.com"), # Change to your verified sender
                To(to_email), # Change to your recipient
                subject,
                Content("text/plain", content)
            )

            # Get a JSON-ready representation of the Mail object
            mail_json = mail.get()

            try:
                # Send an HTTP POST request to /mail/send
                response = sg.client.mail.send.post(request_body=mail_json)
                print(response.status_code)
                print(response.headers)

                return True

            except:
                print("Error")

                return False
