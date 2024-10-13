#################################################### Clean up the terminal
from python.modules.Logger import Log
Log.clear()


#################################################### Initializing File Structure
from python.modules.FileSystem import FileSystem
FileSystem.init()


#################################################### Globals
from python.modules.Globals import Globals

# Prints latest tracked version
Log.center('', '-')
Log.center(Globals.CONF["version"], '-')
Log.center('', '-')


#################################################### Update Logger enabled/disabled after project.json has been loaded
Log.enabled = True if Globals.CONF.get("tools", {}).get("debug") is True else False


#################################################### Initializing Up MySQL
from python.modules.MySQL import MySQL
MySQL.init()


#################################################### Initializing Up Twilio
from python.modules.Twilio import Twilio
Twilio.init()


#################################################### Set up BEE
from python.libs.BEE.BEE import BEE

app = BEE()
# __name__,
# root_path = Globals.CONF["flask"]["root_path"],
# template_folder = Globals.CONF["flask"]["template_folder"],
# static_folder = Globals.CONF["flask"]["static_folder"],
# static_url_path = Globals.CONF["flask"]["static_url_path"]


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
	from python.modules.on_app_start import init
	init()

except Exception as e: Log.error(e)


#################################################### Default Flask Decorations
from python.modules.routeGuard import routeGuard, routeLogs

def before_first_request():
	try:
		from python.modules.before_first_request import before_first_request
		before_first_request()

	except Exception as e: Log.error(e)

with app.app_context(): before_first_request()

@app.before_request
def before_request():
	routeLogs()
	# routeGuard()

# @app.after_request
# def after_request(response):
	# return response

# @app.teardown_request
# def teardown_request_func(error=None):
	# return None


#################################################### Dynamically Imprting All Pages
from python.pages import *
