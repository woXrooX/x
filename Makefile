run: clear
	cd source/ && python main.py

secret_key_generator: clear
	python secret_key_generator.py

clear:
	clear
