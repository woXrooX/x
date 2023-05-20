main: clear
	cd source/ && uwsgi --ini uWSGI.ini

secret_key_generator: clear
	python secret_key_generator.py

clear:
	clear
