main: clear
	cd source/ && uwsgi --disable-logging --ini uWSGI.ini

threaded: clear
	cd source/ && uwsgi --disable-logging --enable-threads --ini uWSGI.ini

clear:
	clear
