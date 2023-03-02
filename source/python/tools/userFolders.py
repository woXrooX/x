import os
from __main__ import APP_RUNNING_FROM, session

def create():
    # Check If User Is In Session
    if "user" not in session: return False

    # Must Match With The Path In .gitignore
    # source/users/id/...
    path = f'{APP_RUNNING_FROM}/users/{session["user"]["id"]}/'

    # Try To Create User Folders
    try:
        # Images
        os.makedirs(f'{path}images', mode=0o777, exist_ok=True)

        # PDF
        os.makedirs(f'{path}PDF', mode=0o777, exist_ok=True)


        return True

    except:
        return False


def delete():
    pass
