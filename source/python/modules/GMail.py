if __name__ != "__main__":

  from python.modules.Globals import Globals
  import smtplib

  # Later We Will Create Class Called GMail That's Why Function Name Started With Capital Letters
  def GMail(to, content, subject = ""):
      # Check If SendGrid Is Enabled
      if "enabled" in Globals.CONF["eMail"]["GMail"] and Globals.CONF["eMail"]["GMail"]["enabled"] is False: return False

      # Check If Content Is Valid
      if not content: return False

      # Check If Subject Is Passed
      if not subject: subject = Globals.CONF["eMail"]["subject"]

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
