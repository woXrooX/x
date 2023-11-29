if __name__ != "__main__":
	import shutil
	from datetime import datetime
	import random

	class Logger:
		#### Variables
		enabled = True
		columns, lines = shutil.get_terminal_size()
		lineLength = columns - 1

		colors = {
			"success": "\033[92m", # bright_green
			"info": "\033[96m", # bright_cyan
			"warning": "\033[93m", # bright_yellow
			"error": "\033[91m", # bright_red

			"custom": "\033[35m", # magenta

			"black": "\033[30m",
			"red": "\033[31m",
			"green": "\033[32m",
			"yellow": "\033[33m",
			"blue": "\033[34m",
			"magenta": "\033[35m",
			"cyan": "\033[36m",
			"white": "\033[37m",
			"bright_black": "\033[90m",
			"bright_red": "\033[91m",
			"bright_green": "\033[92m",
			"bright_yellow": "\033[93m",
			"bright_blue": "\033[94m",
			"bright_magenta": "\033[95m",
			"bright_cyan": "\033[96m",
			"bright_white": "\033[97m",

			"reset": "\033[0m"
		}

		# NOTE: Designed for use as a decorator
		# NOTE: Only for internal usage
		@staticmethod
		def guard(func):
			def wrapper(*args, **kwargs):
				force = kwargs.get('force', False)
				if force is False and Logger.enabled is False: return
				return func(*args, **kwargs)
			return wrapper


		######### APIs / Log Types
		@staticmethod
		def success(text, force = False): Logger.log("success", text, force)

		@staticmethod
		def info(text, force = False): Logger.log("info", text, force)

		@staticmethod
		def warning(text, force = False): Logger.log("warning", text, force)

		@staticmethod
		def error(text, force = False): Logger.log("error", text, force)

		@staticmethod
		def custom(type, text, force = False): Logger.log(type, text, force)

		@staticmethod
		@guard
		def raw(data, force = False): print(data)

		@staticmethod
		@guard
		def center(text, fillChar = ' ', force = False):
			# Calculate The With OF The Terminal
			padding = (Logger.columns - 2 - len(text)) // 2

			# If Empty Text Passed Then Draw Full Line
			if text == "": print(fillChar * Logger.columns)

			# Else Normal Line With Space In The Center
			else: print(fillChar * padding +' '+ text +' '+ fillChar * padding)

		@staticmethod
		def fieldset(content, legend="", type="success", fillChar = '-', force = False):
			if not content: return

			Logger.center(legend, fillChar)
			Logger.raw(content)
			Logger.center('', fillChar)


		@staticmethod
		@guard
		def line(char = "\u2588"): print(Logger.coloredText("bright_cyan", char) * Logger.lineLength)


		######### Helpers
		# NOTE: Helpers only for internal usage
		@staticmethod
		@guard
		def log(type, text, force = False):
			print(f"{Logger.colors.get(type, Logger.colors['custom'])}[{Logger.timestamp()}] [{type.upper()}]\033[0m {text}")


		@staticmethod
		@guard
		def clear(): print("\033[H\033[J")

		@staticmethod
		def coloredText(color, text): return f"{Logger.colors[color]}{text}{Logger.colors['reset']}"

		@staticmethod
		def timestamp(): return datetime.now().strftime('%Y.%m.%d %H:%M:%S')

	# Log Is Alias To Logger
	Log = Logger
