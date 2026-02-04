if __name__ != "__main__":
	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals
	from Python.x.modules.File_System import File_System

	class LLMs():
		@staticmethod
		def generate():
			if Globals.CONF.get("tools", {}).get("SEO", {}).get("LLMs", False) is not True: return

			if "URL" not in Globals.CONF["default"]: return

			Log.warning(f"LLMs.generate(): Generating llms.txt and llms-full.txt files.")

			try:
				project_URL = f'{Globals.CONF["default"]["URL"]["prefix"]}://{Globals.CONF["default"]["URL"]["sub_domain"]}.{Globals.CONF["default"]["URL"]["domain_name"]}.{Globals.CONF["default"]["URL"]["domain_extension"]}'

				File_System.create_file(f"{Globals.PROJECT_PATH}/llms.txt", '', strict=True, overwrite=False)
				File_System.create_file(f"{Globals.PROJECT_PATH}/llms-full.txt", f"", strict=True, overwrite=False)

				File_System.copy_file(f"{Globals.PROJECT_PATH}/", f"{Globals.X_PATH}/www/static", "llms.txt", strict=False)
				File_System.copy_file(f"{Globals.PROJECT_PATH}/", f"{Globals.X_PATH}/www/static", "llms-full.txt", strict=False)

			except Exception as e: Log.error(f"Robots.generate(): Could not generate robots.txt file: {e}")
