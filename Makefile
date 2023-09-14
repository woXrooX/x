main: clear
	cd source/ && uwsgi --disable-logging --ini uWSGI.ini

clear:
	clear
