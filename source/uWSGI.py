# Run directly (python3 uWSGI.py, Flask's development server): build the files first.
# Under uWSGI the ini files run prep.py instead.

if __name__ == "__main__": import prep

from main import app

if __name__ == "__main__": app.run()
