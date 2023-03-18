# https://docs.sendgrid.com/for-developers/sending-email/quickstart-python
# https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication
# pip install sendgrid


if __name__ != "__main__":
    import sendgrid
    from sendgrid.helpers.mail import Mail, Email, To, Content

    class SendGrid:

        @staticmethod
        def test():
            sg = sendgrid.SendGridAPIClient(api_key="MY_API_KEY")
            from_email = Email("test@example.com")  # Change to your verified sender
            to_email = To("woXrooX@mail.ru")  # Change to your recipient
            subject = "Sending with SendGrid is Fun"
            content = Content("text/plain", "and easy to do anywhere, even with Python")
            mail = Mail(from_email, to_email, subject, content)

            # Get a JSON-ready representation of the Mail object
            mail_json = mail.get()

            # Send an HTTP POST request to /mail/send
            response = sg.client.mail.send.post(request_body=mail_json)
            print(response.status_code)
            print(response.headers)
