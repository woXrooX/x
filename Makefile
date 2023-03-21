run: clear
	cd source/ && uwsgi --socket 0.0.0.0:5000 --protocol=http -w wsgi:app

secret_key_generator: clear
	python secret_key_generator.py

clear:
	clear
