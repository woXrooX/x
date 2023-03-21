from main import CONF

# Later We Will Create Class Called GMail That's Why Function Name Started With Capital Letters
def GMail(to, message, subject = ""):
    # Check If GMail Is Enabled
    if CONF["eMail"]["GMail"]["enabled"] == False: return False

    # Check If Subject Is Passed
    if not subject: subject = CONF["eMail"]["subject"]

    import smtplib

    html = f"""\
From: {CONF["eMail"]["GMail"]["eMail"]}
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
        server.login(CONF["eMail"]["GMail"]["eMail"], CONF["eMail"]["GMail"]["password"])
        server.sendmail(CONF["eMail"]["GMail"]["eMail"], to, html)
        server.quit()

        return True

    except:
        return False
