if __name__ != "__main__":
    import pathlib # X_RUNNING_FROM
    import os # PROJECT_RUNNING_FROM
    import main # X_RUNNING_FROM

    class Globals():
        #### Paths
        X_RUNNING_FROM = pathlib.Path(main.__file__).parent.absolute()

        # Go Back Two Times From "X_RUNNING_FROM"
        PROJECT_RUNNING_FROM = os.path.abspath(os.path.join(X_RUNNING_FROM, '../..'))

        #### X
        CONF = {}
        LANG_DICT = {}
        USER_AUTHENTICITY_STATUSES = {}
        USER_ROLES = {}
        USER_ASSIGNED_ROLES = []

        #### Project
        PROJECT = {}
        PROJECT_CSS = None
        PROJECT_SVG = {}
        PROJECT_LANG_DICT = {}

        #### Mix
        PUBLIC_CONF = {}
