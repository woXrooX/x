if __name__ != "__main__":
    import os
    from main import APP_RUNNING_FROM, PARENT_RUNNING_FROM, session
    from python.tools.Logger import Log

    class FileSystem:
        @staticmethod
        def init():
            ################ Folders
            Log.center("Creating Folders START", '-')

            ## x/source/assets
            FileSystem.createFolder(f'{APP_RUNNING_FROM}/assets/')

            ## CSS
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/CSS/')

            ## fonts
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/fonts/')

            ## JS
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/JS/')

            ## pages
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/pages/')
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/pages/back')
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/pages/front')

            ## SVG
            FileSystem.createFolder(f'{PARENT_RUNNING_FROM}/SVG/')

            Log.center("Creating Folders END", '-')

            ################ Files
            Log.line()
            Log.center("Creating Files START", '-')

            # project.json
            FileSystem.createFile(f"{PARENT_RUNNING_FROM}/project.json", "{}")


            # languageDictionary.json
            FileSystem.createFile(f"{PARENT_RUNNING_FROM}/languageDictionary.json", '{"theX": {"en": "The X"}}')

            # pages/back/home.py
            FileSystem.createFile(f"{PARENT_RUNNING_FROM}/pages/back/home.py")

            # pages/front/home.js
            FileSystem.createFile(f"{PARENT_RUNNING_FROM}/pages/front/home.js")

            # styles.css
            FileSystem.createFile(f"{PARENT_RUNNING_FROM}/CSS/styles.css")

            Log.center("Creating Files END", '-')
            Log.line()

        @staticmethod
        def createFolder(path):
            try:
                Log.info(f"Folder: {path}")
                os.makedirs(f'{path}', mode=0o777, exist_ok=True)

            except:
                Log.error(f"Could Not Create The Folder: {path}")
                sys.exit()

        @staticmethod
        def createFile(pathNameExtension, content = ""):
            if not os.path.exists(f"{pathNameExtension}"):
                try:
                    Log.info(f"File: {pathNameExtension}")
                    with open(f'{pathNameExtension}', 'w') as f:
                        f.write(f"{content}")

                except:
                    Log.error(f"Could Not Create The File: {path}")
                    sys.exit()

        @staticmethod
        def initUserFolders():
            # Check If User Is In Session
            if "user" not in session: return False

            # Must Match With The Path In .gitignore
            # source/users/id/...
            path = f'{APP_RUNNING_FROM}/users/{session["user"]["id"]}/'

            # Try To Create User Folders
            try:
                # ID
                os.makedirs(f'{path}', mode=0o777, exist_ok=True)

                # Images
                os.makedirs(f'{path}images', mode=0o777, exist_ok=True)

                # PDF
                os.makedirs(f'{path}PDF', mode=0o777, exist_ok=True)

                return True

            except:
                Log.error(f"Could Not Create User Folder(s) @: {path}")

                return False
