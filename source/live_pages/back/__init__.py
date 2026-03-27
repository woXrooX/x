import os

from Python.x.modules.Globals import Globals

"""
The __all__ variable is a special variable in
Python that is used to specify which objects should be exported by a module
when it is imported using the from module import * syntax.

When a module is imported using the from module import * syntax,
all names defined in the module are imported into the current namespace,
except for those names that start with an underscore (_).
However, to prevent the import of all names,
the module can define a variable named __all__ that lists the names that should be exported.
"""

__all__ = []

for file in os.listdir(f"{Globals.X_PATH}/live_pages/back"):
	filename = os.fsdecode(file)

	if filename.endswith(".py") and not filename.endswith("__init__.py"):

		filename = os.path.splitext(filename)[0]
		__all__.append(filename)
