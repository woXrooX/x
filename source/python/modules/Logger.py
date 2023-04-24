if __name__ != "__main__":
    import shutil
    from datetime import datetime
    import random

    class Logger:

        #### Variables
        columns, lines = shutil.get_terminal_size()
        lineLength = columns - 1

        @staticmethod
        def success(text):
            print(Logger.coloredText("bright_green", f"[{Logger.timestamp()}] [SUCCESS] ") + text)

        @staticmethod
        def info(text):
            print(Logger.coloredText("bright_cyan", f"[{Logger.timestamp()}] [INFO] ") + text)

        @staticmethod
        def warning(text):
            print(Logger.coloredText("bright_yellow", f"[{Logger.timestamp()}] [WARNING] ") + text)

        @staticmethod
        def error(text):
            print(Logger.coloredText("bright_red", f"[{Logger.timestamp()}] [ERROR] ") + text)


        @staticmethod
        def clear():
            # import os
            # os.system('cls' if os.name == 'nt' else 'clear')

            print("\033[H\033[J")


        @staticmethod
        def line(char = "\u2588"):
            print(Logger.coloredText("bright_cyan", char) * Logger.lineLength)


        @staticmethod
        def coloredText(color, text):
            return f"{colors[color]}{text}{colors['reset']}"


        @staticmethod
        def centeredText(text, fillChar = ' '):
            padding = (Logger.columns - 2 - len(text)) // 2
            return fillChar * padding +' '+ text +' '+ fillChar * padding


        @staticmethod
        def center(text, fillChar = ' '):
            print(Logger.centeredText(text, fillChar))


        @staticmethod
        def timestamp():
            return datetime.now().strftime('%Y.%m.%d %H:%M:%S')


        @staticmethod
        def brand():
            # Randomly Get One Of The ASCII Text
            brand = brands[random.randrange(0, len(brands))]

            Logger.line()

            print(Logger.coloredText("bright_cyan", brand))

            Logger.line()


    colors = {
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
