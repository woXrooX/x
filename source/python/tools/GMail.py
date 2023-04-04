from main import CONF

# Later We Will Create Class Called GMail That's Why Function Name Started With Capital Letters
def GMail(to, content, subject = ""):
    # Check If GMail Is In CONF["eMail"]
    if "GMail" not in CONF["eMail"]: return False

    # Check If content Is Valid
    if not content: return False

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
    <div>{content}</div>
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
