main: clear
	cd source/ && uwsgi --disable-logging --ini uWSGI_development.ini

production: clear
	cd source/ && uwsgi --ini uWSGI_production.ini

clear:
	clear
