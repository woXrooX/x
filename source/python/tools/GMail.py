
def GMail(to, message):
    import smtplib

    # to = "brosappsalone@gmail.com"
    gMail = "woXrooX@gmail.com"
    password = "hiptmhqcgcpwiijn"

    subject = "X-WebApp"
    # message = "Hi! Friend:)"

    html = f"""\
From: {gMail}
To: {to}
Subject: {subject}
MIME-Version: 1.0
Content-Type: text/html

<html>
  <body>
    <div>Code:</div>
    <div>{message}</div>
  </body>
</html>
    """
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.login(gMail, password)
        server.sendmail(gMail, to, html)
        server.quit()

        return True

    except:
        return False
