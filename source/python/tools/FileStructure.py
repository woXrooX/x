if __name__ != "__main__":
    import os
    from main import APP_RUNNING_FROM, PARENT_RUNNING_FROM

    class FileStructure:
        @staticmethod
        def init():
            ################ Folders
            print("""
--------------------------------------
-------------------------------------- Creating Folders
--------------------------------------
            """)

            ## x/source/assets
            FileStructure.createFolder(f'{APP_RUNNING_FROM}/assets/')

            ## CSS
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/CSS/')

            ## fonts
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/fonts/')

            ## JS
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/JS/')

            ## pages
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/pages/')
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/pages/back')
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/pages/front')

            ## SVG
            FileStructure.createFolder(f'{PARENT_RUNNING_FROM}/SVG/')

            ################ Files
            print("""
--------------------------------------
-------------------------------------- Creating Files
--------------------------------------
            """)
            # project.json
            FileStructure.createFile(f"{PARENT_RUNNING_FROM}/project.json", "{}")


            # languageDictionary.json
            FileStructure.createFile(f"{PARENT_RUNNING_FROM}/languageDictionary.json", '{"theX": {"en": "The X"}}')

            # pages/back/home.py
            FileStructure.createFile(f"{PARENT_RUNNING_FROM}/pages/back/home.py")

            # pages/front/home.js
            FileStructure.createFile(f"{PARENT_RUNNING_FROM}/pages/front/home.js")

            # styles.css
            FileStructure.createFile(f"{PARENT_RUNNING_FROM}/CSS/styles.css")

        @staticmethod
        def createFolder(path):
            try:
                print(f"Folder: {path}")
                os.makedirs(f'{path}', mode=0o777, exist_ok=True)
            except:
                print(f"Error: Could Not Create The Folder -> {path}")
                sys.exit()

        @staticmethod
        def createFile(pathNameExtension, content = ""):
            if not os.path.exists(f"{pathNameExtension}"):
                print(f"File: {pathNameExtension}")
                with open(f'{pathNameExtension}', 'w') as f:
                    f.write(f"{content}")
