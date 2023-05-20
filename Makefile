main: clear
	cd source/ && uwsgi --ini uwsgi.ini

secret_key_generator: clear
	python secret_key_generator.py

clear:
	clear
