#################################################### Clean up the terminal
from Python.x.modules.Logger import Log
Log.clear()
Log.center('', '|')
Log.center("Initializing x", '|')
Log.center('', '|')

#################################################### Initializing File Structure
from Python.x.modules.File_System import File_System
File_System.init()


#################################################### Generating sitemap
from Python.x.modules.SEO.Sitemap import Sitemap
Sitemap.generate()


#################################################### Generating sitemap
from Python.x.modules.SEO.Robots import Robots
Robots.generate()


#################################################### Globals
from Python.x.modules.Globals import Globals

# Prints latest tracked version
Log.center('', '-', type_name="bright_black")
Log.center(f"x version: {Globals.CONF['version']}", ' ')
Log.center('', '-', type_name="bright_black")


#################################################### Update Logger enabled/disabled after project.json has been loaded
Log.enabled = True if Globals.CONF.get("tools", {}).get("debug") is True else False


#################################################### Initializing MySQL
from Python.x.modules.MySQL import MySQL
MySQL.init()


#################################################### Initializing Twilio
from Python.x.modules.Twilio import Twilio
Twilio.init()


#################################################### Set up BEE
from python.libs.BEE.BEE import BEE

app = BEE()
# __name__,
# root_path = Globals.CONF["flask"]["root_path"],
# template_folder = Globals.CONF["flask"]["template_folder"],
# static_folder = Globals.CONF["flask"]["static_folder"],
# static_url_path = Globals.CONF["flask"]["static_url_path"]
#################################################### Initializing Stripe
from Python.x.modules.Stripe.Stripe import Stripe
Stripe.init()


#################################################### Secret Key
import os
# Disable random secret_key assignment on each server restart when debug is True
if Globals.CONF.get("tools", {}).get("debug") is True: app.secret_key = b'12345'

# Generates new "secret_key" every time when server is started
else: app.secret_key = os.urandom(24)


#################################################### Permanent session
from datetime import timedelta
app.permanent_session_lifetime = timedelta(days=31)


#################################################### On app start
try:
	from Python.project.modules.on_app_start import init
	init()

except Exception as e: Log.error(e)


#################################################### Default Flask Decorations
from Python.x.modules.route_guard import route_logs

def before_first_request():
	try:
		from Python.project.modules.before_first_request import before_first_request
		before_first_request()

	except Exception as e: Log.error(e)

with app.app_context(): before_first_request()

@app.before_request
def before_request():
	route_logs()

# @app.after_request
# def after_request(response):
	# return response

# @app.teardown_request
# def teardown_request_func(error=None):
	# return None


#################################################### Dynamically Imprting All Pages
from Python.live_pages import *


#################################################### RUN using Flask (For Development)
### Flask server
# if __name__ == "__main__":
	# No SSL
	# app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True)

	# OpenSSL
	# app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
