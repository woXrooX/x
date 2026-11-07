# Prepares the files the app runs from, once per start, before any worker loads the app:
# the project's folders and default files, and the generated live_pages/, www/ and Python/project/modules/.
#
# uWSGI runs it with exec-asap (see uWSGI_development.ini and uWSGI_production.ini).
# Writing to disk happens only here: with lazy-apps every worker imports main.py on its own,
# so a write in main.py would happen in every worker at the same time.
#
# Needs only the standard library. On failure it exits with code 1, and uWSGI stops before any worker starts.




#################################################### Init Globals
from Python.x.modules.Globals import Globals
from Python.x.modules.Logger import Log

Globals.init_CONF()

# Update Logger enabled/disabled after project.json has been loaded
Log.enabled = True if Globals.CONF.get("tools", {}).get("debug") is True else False




#################################################### Clean up the terminal
Log.clear()
Log.center('', '|')
Log.center("x prep", '|')
Log.center('', '|')




#################################################### Language dictionary
Globals.init_LANGUAGE_DICTIONARY()




#################################################### Files and folders
from Python.x.modules.File_System_Operations import File_System_Operations
File_System_Operations.init()




#################################################### SEO
# NOTE:
# sitemap.xml isn't built here: it lists every page's endpoints, and a page's config
# only exists once the app imports the page. main.py builds it in memory instead.

from Python.x.modules.SEO.LLMs.LLMs import LLMs
LLMs.generate()

from Python.x.modules.SEO.Robots import Robots
Robots.generate()
