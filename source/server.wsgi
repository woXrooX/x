import sys
from main import APP_RUNNING_FROM

sys.path.insert(0, APP_RUNNING_FROM)
from main import app as application
