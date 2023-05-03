if __name__ != "__main__":
    import os
    import sys
    import shutil
    import json
    import yaml
    from main import session
    from python.modules.Logger import Log
    from python.modules.Globals import Globals

    class FileSystem:
        ####### Helpers
        # Helpers With Strict Mode True Will Exists The Script (Stop The Server) On Fail

        @staticmethod
        def createFolder(path, strict = True):
            try:
                Log.info(f"Folder: {path}")

                os.makedirs(f'{path}', mode=0o777, exist_ok=True)

                return True

            except:
                Log.error(f"Could Not Create The Folder: {path}")

                if strict is True: sys.exit()

                return False

        @staticmethod
        def createFile(pathNameExtension, content = "", strict = True):
            if not os.path.exists(f"{pathNameExtension}"):
                try:
                    Log.info(f"File: {pathNameExtension}")

                    with open(f'{pathNameExtension}', 'w') as f:
                        f.write(f"{content}")

                    return True

                except:
                    Log.error(f"Could Not Create The File: {path}")

                    if strict is True: sys.exit()

                    return False

        @staticmethod
        def copyFile(fromPath, toPath, file, strict = True):
            try:
                shutil.copy(f"{fromPath}/{file}", toPath)

                Log.info(f"File Copied: {file}")

                return True

            except:
                Log.error(f"Could Not Copy The File: {file}")

                if strict is True: sys.exit()

                return False

        # Will Copy All The Files In A Folder With A Given Extension
        @staticmethod
        def copyFiles(fromPath, toPath, extension = None, strict = True):
            try:
                files = os.listdir(fromPath)

                for file in files:
                    # Add Check Here If Extension Passed Copy Files Only With That Given Extension

                    FileSystem.copyFile(fromPath, toPath, file)

                Log.success(f"Files Are Copied To: {toPath}")

                return True

            except:
                Log.error(f"Could Not Copy The Files @: {fromPath}")

                if strict is True: sys.exit()

                return False

        @staticmethod
        def deleteFile(pathAndFile, strict = True):
            try:
                os.remove(f"{pathAndFile}")

                Log.success(f"File Deleted Successfully: {pathAndFile}")

                return True

            except:
                Log.error(f"Could Not Delete The Files @: {pathAndFile}")

                if strict is True: sys.exit()

                return False


        ############## System
        # Initiate System Files And Folders
        @staticmethod
        def init():
            ################################ Creating
            ################ Folders
            Log.center("Creating Folders", '-')

            ## x/source/assets
            FileSystem.createFolder(f'{Globals.X_RUNNING_FROM}/assets/')

            ## CSS
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/CSS/')

            ## fonts
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/fonts/')

            ## JS
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/JS/')

            ## pages
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/pages/')
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/pages/back')
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/pages/front')

            ## SVG
            FileSystem.createFolder(f'{Globals.PROJECT_RUNNING_FROM}/SVG/')

            Log.line()

            ################ Files
            Log.center("Creating Files", '-')

            # project.json
            FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/project.json", "{}")

            # languageDictionary.json
            FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/languageDictionary.json", '{"theX": {"en": "The X"}}')

            # pages/back/home.py
            FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/pages/back/home.py",
'''from main import app, request, render_template
from python.modules.tools import pageGuard
from python.modules.response import response
from python.modules.Globals import Globals

@app.route("/", methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
@pageGuard("home")
def home():
    if request.method == "GET":
        return render_template("index.html", **globals())'''
            )

            # pages/front/home.js
            FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/pages/front/home.js",
'''export const TITLE = window.Lang.use("home");

export default function content(){

  return "Home";
}'''
            )

            # styles.css
            FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/CSS/styles.css")

            # footer.js
            FileSystem.createFile(f"{Globals.PROJECT_RUNNING_FROM}/JS/footer.js", 'export default function footer(){\n\treturn "The X";\n}')

            Log.line()

            ################################ Reading
            ################ Loading Files
            Log.center("Loading Files", '-')

            ######### Internals
            # config.yaml
            FileSystem.loadDefaultConfigurations()

            # Internal languageDictionary.json
            FileSystem.loadInternalLanguageDictionary()

            ######### Externals
            # project.json
            FileSystem.loadProjectConfigurations()

            # CSS
            FileSystem.loadExternalCSS()

            # SVG
            FileSystem.loadExternalSVG()

            # External languageDictionary.json
            FileSystem.loadExternalLanguageDictionary()

            ######### Merge
            # Merge Configurations
            FileSystem.mergeConfigurations()

            # Merge Configurations
            FileSystem.mergeLanguageDictionaries()

            Log.line()

            ################################ Copying
            Log.center("Copying Pages", '-')

            # Pages (Back-End)
            FileSystem.copyPagesBackEnd()

            # Pages (Front-End)
            FileSystem.copyPagesFrontEnd()

            Log.center("Copying JavaScripts", '-')

            # JS
            FileSystem.copyJavaScripts()

            # Fonts
            Log.center("Copying FONTS", '-')
            FileSystem.copyFonts()

            Log.line()

        ####### Copy
        # Copy Pages (Back-End)
        @staticmethod
        def copyPagesBackEnd():
            if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/pages/back", f"{str(Globals.X_RUNNING_FROM)}/python/pages") is True:
                Log.success("Pages Are Copied (Back-End)")

            else:
                Log.error("Could Not Copy The Pages (Back-End)")
                sys.exit()

        # Copy Pages (Back-End)
        @staticmethod
        def copyPagesFrontEnd():
            if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/pages/front", f"{str(Globals.X_RUNNING_FROM)}/js/pages") is True:
                Log.success("Pages Are Copied (Front-End)")

            else:
                Log.error("Could Not Copy The Pages (Front-End)")
                sys.exit()

        # Copy JavaScripts
        @staticmethod
        def copyJavaScripts():
            if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/JS", f"{str(Globals.X_RUNNING_FROM)}/js/modules") is True:
                Log.success("JavaScripts Are Copied")

            else:
                Log.error("Could Not Copy The JavaScripts")
                sys.exit()

        # Copy Fonts
        @staticmethod
        def copyFonts():
            if FileSystem.copyFiles(f"{Globals.PROJECT_RUNNING_FROM}/fonts", f"{str(Globals.X_RUNNING_FROM)}/fonts") is True:
                Log.success("Fonts Are Copied")

            else: Log.error("Could Not Copy The Fonts")

        ####### Load
        #### Internals
        # Configurations - config.yaml
        @staticmethod
        def loadDefaultConfigurations():
            # global CONF

            try:
                with open(f"{Globals.X_RUNNING_FROM}/yaml/config.yaml", 'r') as file:
                    Globals.CONF = yaml.safe_load(file)

                Log.success("Loaded: config.yaml")

            except:
                Log.error("Could Not Load The config.yaml")
                sys.exit()

        # Language Dictionary
        @staticmethod
        def loadInternalLanguageDictionary():
            try:
                with open(f'{Globals.X_RUNNING_FROM}/json/languageDictionary.json', encoding="utf8") as file:
                    Globals.LANG_DICT = json.load(file)

                Log.success("Internal languageDictionary.json Is Loaded")

            except:
                Log.error("Could Not Read The Internal languageDictionary.json")

        #### Externals
        # Project Configurations - project.json
        @staticmethod
        def loadProjectConfigurations():
            try:
                with open(f"{Globals.PROJECT_RUNNING_FROM}/project.json", 'r') as file:
                    Globals.PROJECT = json.load(file)

                Log.success("Loaded: project.json")

            except:
                Log.error("Could Not Load The project.json")
                sys.exit()

        # Load External CSS
        @staticmethod
        def loadExternalCSS():
            try:
                with open(f'{Globals.PROJECT_RUNNING_FROM}/CSS/styles.css', "r") as css:
                    Globals.PROJECT_CSS = css.read()

                Log.success("External CSS Files Are Loaded")

            except:
                Log.warning("Could Not Read The External CSS")

        # Load External SVG
        @staticmethod
        def loadExternalSVG():
            for file in os.listdir(f'{Globals.PROJECT_RUNNING_FROM}/SVG'):
                # Check If File Is A SVG File
                if not file.endswith(".svg"): continue

                try:
                    with open(f'{Globals.PROJECT_RUNNING_FROM}/SVG/{file}', "r") as svg:
                        Globals.PROJECT_SVG[os.path.splitext(file)[0]] = svg.read()

                    Log.success(f"SVG Loaded: {file}")

                except:
                    Log.warning(f"Could Not Load The SVG: {file}")

        @staticmethod
        def loadExternalLanguageDictionary():
            try:
                with open(f"{Globals.PROJECT_RUNNING_FROM}/languageDictionary.json", 'r') as file:
                    Globals.PROJECT_LANG_DICT = json.load(file)

                Log.success("External languageDictionary.json Is Loaded")

            except:
                Log.error("Could Not Read The External languageDictionary.json")


        #### Merge
        # Merge config.yaml And project.json
        # Merge Project Dependent Configurations To Default Configurations. Override Defaults
        @staticmethod
        def mergeConfigurations():
            #### Merge
            # Database
            if "database" in Globals.PROJECT:
                if "database" in Globals.CONF: Globals.CONF["database"].update(Globals.PROJECT["database"])
                else: Globals.CONF["database"] = Globals.PROJECT["database"]

            # eMail
            if "eMail" in Globals.PROJECT:
                Globals.CONF["eMail"].update(Globals.PROJECT["eMail"])

            # Defaults
            if "default" in Globals.PROJECT:
                if "default" in Globals.CONF: Globals.CONF["default"].update(Globals.PROJECT["default"])
                else: Globals.CONF["default"] = Globals.PROJECT["default"]

            # Menu
            if "menu" in Globals.PROJECT:
                Globals.CONF["menu"] = Globals.PROJECT["menu"]

            # Pages
            if "pages" in Globals.PROJECT:
                Globals.CONF["pages"] = Globals.PROJECT["pages"]

            # OpenAI
            if "OpenAI" in Globals.PROJECT:
                Globals.CONF["OpenAI"] = Globals.PROJECT["OpenAI"]

            #### Public Configurations
            Globals.PUBLIC_CONF["default"] = Globals.CONF["default"]
            Globals.PUBLIC_CONF["menu"] = Globals.CONF["menu"]
            Globals.PUBLIC_CONF["pages"] = Globals.CONF["pages"]
            Globals.PUBLIC_CONF["username"] = Globals.CONF["username"]
            Globals.PUBLIC_CONF["password"] = Globals.CONF["password"]
            Globals.PUBLIC_CONF["phoneNumber"] = Globals.CONF["phoneNumber"]

        def mergeLanguageDictionaries():
            # Override The LANG_DICT w/ The PROJECT_LANG_DICT
            Globals.LANG_DICT.update(Globals.PROJECT_LANG_DICT)


        ############## User
        @staticmethod
        def initUserFolders(id = None):
            ID = None

            if id is not None:
                if isinstance(id, int) and id > 0: ID = id
                else:
                    Log.warning(f"Invalid Argument Passed To The Method @ FileSystem.initUserFolders(): {id}. Due To That Could Not Initiate User Folders")

                    return False

            elif "user" in session: ID = session["user"]["id"]

            else: return False


            # Must Match With The Path In .gitignore
            # source/users/id/...
            path = f'{Globals.X_RUNNING_FROM}/users/{ID}/'

            # Try To Create User Folders
            try:
                # ID
                os.makedirs(f'{path}', mode=0o777, exist_ok=True)

                # Images
                os.makedirs(f'{path}images', mode=0o777, exist_ok=True)

                # PDF
                os.makedirs(f'{path}PDF', mode=0o777, exist_ok=True)

                Log.success(f"User Folders Created @: {path}")

                return True

            except:
                Log.error(f"Could Not Create User Folder(s) @: {path}")

                return False

        @staticmethod
        def deleteUserFiles(id):
            try:
                shutil.rmtree(f'{Globals.X_RUNNING_FROM}/users/{id}/')

                Log.success(f"User Files Deleted. User ID: {id}")

                return True

            except:
                Log.error(f"Could Not Delete User Files. User ID: {id}")

                return False
