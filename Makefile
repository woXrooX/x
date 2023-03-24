main: clear
	cd source/ && uwsgi --socket 0.0.0.0:5000 --protocol=http -w wsgi:app
	# http://localhost:5000/

secure: clear
	cd source/ && uwsgi --shared-socket 0.0.0.0:8443 --https =0,../../SSL/x.crt,../../SSL/x.key -w wsgi:app
	# https://localhost:8443/

secret_key_generator: clear
	python secret_key_generator.py

clear:
	clear
