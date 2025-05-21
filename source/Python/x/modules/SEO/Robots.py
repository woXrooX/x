if __name__ != "__main__":
	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals
	from Python.x.modules.File_System import File_System

	class Robots():
		@staticmethod
		def generate():
			if Globals.CONF.get("tools", {}).get("SEO", {}).get("Robots", False) is not True: return

			if "URL" not in Globals.CONF["default"]: return

			Log.warning(f"Robots.generate(): Generating robots.txt file.")

			try:
				project_URL = f'{Globals.CONF["default"]["URL"]["prefix"]}://{Globals.CONF["default"]["URL"]["sub_domain"]}.{Globals.CONF["default"]["URL"]["domain_name"]}.{Globals.CONF["default"]["URL"]["domain_extension"]}'

				File_System.create_file(f"{Globals.X_PATH}/www/static/robots.txt", f"User-agent: *\nAllow: /\nSitemap: {project_URL}/sitemap.xml", strict=True, overwrite=True)

			except Exception as e: Log.error(f"Robots.generate(): Could not generate robots.txt file: {e}")
