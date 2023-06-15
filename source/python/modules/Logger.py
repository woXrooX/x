if __name__ != "__main__":
    import shutil
    from datetime import datetime
    import random

    from python.modules.Globals import Globals

    class Logger:

        #### Variables
        columns, lines = shutil.get_terminal_size()
        lineLength = columns - 1

        colors = {
            "success": "\033[92m", # bright_green
            "info": "\033[96m", # bright_cyan
            "warning": "\033[93m", # bright_yellow
            "error": "\033[91m", # bright_red

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


        ######### APIs / Log Types
        @staticmethod
        def success(text, force = False): Logger.log(text, "success", force)

        @staticmethod
        def info(text, force = False): Logger.log(text, "info", force)

        @staticmethod
        def warning(text, force = False): Logger.log(text, "warning", force)

        @staticmethod
        def error(text, force = False): Logger.log(text, "error", force)

        @staticmethod
        def raw(data): print(data)

        @staticmethod
        def center(text, fillChar = ' '): print(Logger.centeredText(text, fillChar))

        @staticmethod
        def line(char = "\u2588"): print(Logger.coloredText("bright_cyan", char) * Logger.lineLength)

        @staticmethod
        def brand():
            # Randomly Get One Of The ASCII Text
            brand = brands[random.randrange(0, len(brands))]

            Logger.line()

            print(Logger.coloredText("bright_cyan", brand))

            Logger.line()
        

        ######### Helpers - Supposed To Be "Private"
        @staticmethod
        def log(text, type, force = False):
            # Check If Debugging Mode Is Enabled
            if(
                force is True or
                "default" not in Globals.CONF or
                "default" in Globals.CONF and Globals.CONF["default"]["debug"] is not False
            ): print(Logger.coloredText(type, f"[{Logger.timestamp()}] [{type.upper()}]"), text)


        @staticmethod
        def clear(): print("\033[H\033[J")

        @staticmethod
        def coloredText(color, text): return f"{Logger.colors[color]}{text}{Logger.colors['reset']}"

        @staticmethod
        def centeredText(text, fillChar = ' '):
            padding = (Logger.columns - 2 - len(text)) // 2
            return fillChar * padding +' '+ text +' '+ fillChar * padding

        @staticmethod
        def timestamp(): return datetime.now().strftime('%Y.%m.%d %H:%M:%S')


    brands = [
        """
████████╗██╗  ██╗███████╗    ██╗  ██╗
╚══██╔══╝██║  ██║██╔════╝    ╚██╗██╔╝
   ██║   ███████║█████╗       ╚███╔╝
   ██║   ██╔══██║██╔══╝       ██╔██╗
   ██║   ██║  ██║███████╗    ██╔╝ ██╗
   ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝
        """,

        """
TTTTTTTTTTTTTTTTTTTTTTThhhhhhh                                      XXXXXXX       XXXXXXX
T:::::::::::::::::::::Th:::::h                                      X:::::X       X:::::X
T:::::::::::::::::::::Th:::::h                                      X:::::X       X:::::X
T:::::TT:::::::TT:::::Th:::::h                                      X::::::X     X::::::X
TTTTTT  T:::::T  TTTTTT h::::h hhhhh           eeeeeeeeeeee         XXX:::::X   X:::::XXX
        T:::::T         h::::hh:::::hhh      ee::::::::::::ee          X:::::X X:::::X
        T:::::T         h::::::::::::::hh   e::::::eeeee:::::ee         X:::::X:::::X
        T:::::T         h:::::::hhh::::::h e::::::e     e:::::e          X:::::::::X
        T:::::T         h::::::h   h::::::he:::::::eeeee::::::e          X:::::::::X
        T:::::T         h:::::h     h:::::he:::::::::::::::::e          X:::::X:::::X
        T:::::T         h:::::h     h:::::he::::::eeeeeeeeeee          X:::::X X:::::X
        T:::::T         h:::::h     h:::::he:::::::e                XXX:::::X   X:::::XXX
      TT:::::::TT       h:::::h     h:::::he::::::::e               X::::::X     X::::::X
      T:::::::::T       h:::::h     h:::::h e::::::::eeeeeeee       X:::::X       X:::::X
      T:::::::::T       h:::::h     h:::::h  ee:::::::::::::e       X:::::X       X:::::X
      TTTTTTTTTTT       hhhhhhh     hhhhhhh    eeeeeeeeeeeeee       XXXXXXX       XXXXXXX
        """

    ]

    # Log Is Alias To Logger
    Log = Logger
