#################################################### Flask Imports
from flask import Flask, render_template, request, session, redirect, url_for, make_response, send_from_directory, abort


from Python.x.modules.Globals import Globals
from Python.x.modules.Logger import Log
from Python.x.modules.File_System import File_System

#################################################### Init Globals
Globals.init_CONF()

# Once CONF is ready
# Update Logger enabled/disabled after project.json has been loaded
Log.enabled = True if Globals.CONF.get("tools", {}).get("debug") is True else False

Globals.init_LANGUAGE_DICTIONARY()




#################################################### Clean up the terminal
Log.clear()
Log.center('', '|')
Log.center("x is running", '|')
Log.center('', '|')




#################################################### Initializing File_System_Operations
from Python.x.modules.File_System_Operations import File_System_Operations
File_System_Operations.init()




#################################################### Prints latest tracked version
Log.center('', '-', type_name="bright_black")
Log.center(f"x version: {Globals.CONF['version']}", ' ')
Log.center('', '-', type_name="bright_black")




#################################################### Initializing MySQL
from Python.x.modules.MySQL import MySQL
MySQL.init()




#################################################### Initializing Twilio
from Python.x.modules.Twilio import Twilio
Twilio.init()




#################################################### Initializing Stripe
from Python.x.modules.Stripe.Stripe import Stripe
Stripe.init()




#################################################### Flask APP
app = Flask(
	__name__,
	root_path = Globals.CONF["flask"]["root_path"],
	template_folder = Globals.CONF["flask"]["template_folder"],
	static_folder = Globals.CONF["flask"]["static_folder"],
	static_url_path = Globals.CONF["flask"]["static_URL_path"]
)

app.config.update(
	# JavaScript cannot read the cookie
	SESSION_COOKIE_HTTPONLY = True,

	# Cookie only sent over HTTPS
	SESSION_COOKIE_SECURE = True,

	# Blocks cookies on cross-site POSTs
	SESSION_COOKIE_SAMESITE = "Lax"
)




#################################################### CSRF token
from Python.x.modules.CSRF import get_CSRF_token
app.jinja_env.globals["get_CSRF_token"] = get_CSRF_token




#################################################### Secret key
import os

# Debugging mode static secret_key
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

def app_before_first_request():
	try:
		from Python.project.modules.before_first_request import before_first_request
		before_first_request()

	except Exception as e: Log.error(e)

with app.app_context(): app_before_first_request()


@app.before_request
def app_before_request():
	route_logs()

	try:
		from Python.project.modules.before_request import before_request
		before_request()

	except Exception as e: Log.error(e)

@app.after_request
def app_after_request(response):
	try:
		from Python.project.modules.after_request import after_request
		return after_request(response)

	except Exception as e: Log.error(e)

	return response

# @app.teardown_request
# def teardown_request_func(error=None):
	# return None




#################################################### Dynamically imprting all pages
from Python.live_pages import *




#################################################### SEO
from Python.x.modules.SEO.Sitemap import Sitemap
Sitemap.generate()

from Python.x.modules.SEO.Robots import Robots
Robots.generate()

from Python.x.modules.SEO.LLMs.LLMs import LLMs
LLMs.generate()




#################################################### RUN using Flask (For Development)
### Flask server
# if __name__ == "__main__":
	# No SSL
	# app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True)

	# OpenSSL
	# app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
