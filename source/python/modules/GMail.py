from python.modules.Globals import Globals

# Later We Will Create Class Called GMail That's Why Function Name Started With Capital Letters
def GMail(to, content, subject = ""):
    # Check If GMail Is In CONF["eMail"]
    if "GMail" not in Globals.CONF["eMail"]: return False

    # Check If content Is Valid
    if not content: return False

    # Check If Subject Is Passed
    if not subject: subject = Globals.CONF["eMail"]["subject"]

    import smtplib

    html = f"""\
From: {Globals.CONF["eMail"]["GMail"]["eMail"]}
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
        server.login(Globals.CONF["eMail"]["GMail"]["eMail"], Globals.CONF["eMail"]["GMail"]["password"])
        server.sendmail(Globals.CONF["eMail"]["GMail"]["eMail"], to, html)
        server.quit()

        return True

    except:
        return False
