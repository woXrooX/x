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

# Loop Through All Files And Detect Python Files Exclude And __init_.py
for file in os.listdir(f"{Globals.X_RUNNING_FROM}/Python/live_pages"):

    # Convert A File System Encoded Byte String Into A Unicode String
    filename = os.fsdecode(file)

    # Check If File Is .py File And Not __init__.py
    if filename.endswith(".py") and not filename.endswith("__init__.py"):

        # Remove ".py" Part From File
        filename = os.path.splitext(filename)[0]
        __all__.append(filename)
