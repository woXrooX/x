if __name__ != "__main__":
	import json
	from datetime import datetime
	import xml.etree.ElementTree as ET
	from xml.dom import minidom

	from Python.x.modules.Logger import Log
	from Python.x.modules.Globals import Globals
	from Python.x.modules.File_System import File_System

	class Sitemap():
		@staticmethod
		def generate():
			if Globals.CONF.get("tools", {}).get("SEO", {}).get("Sitemap", False) is not True: return

			if "URL" not in Globals.CONF["default"]: return

			Log.warning(f"Sitemap.generate(): Generating sitemap.xml file.")

			try:
				# Create the root element
				urlset = ET.Element('urlset')
				urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

				# Current date for lastmod
				today = datetime.now().strftime('%Y-%m-%d')

				project_URL = f'{Globals.CONF["default"]["URL"]["prefix"]}://{Globals.CONF["default"]["URL"]["sub_domain"]}.{Globals.CONF["default"]["URL"]["domain_name"]}.{Globals.CONF["default"]["URL"]["domain_extension"]}'

				for page in Globals.CONF["pages"]:
					# Page must be enabled
					if not Globals.CONF["pages"][page].get("enabled", False): continue

					# Skip pages with roles, roles_not, plans or url_args required
					if "roles" in Globals.CONF["pages"][page]: continue
					if "roles_not" in Globals.CONF["pages"][page]: continue
					if "plans" in Globals.CONF["pages"][page]: continue
					if "url_args" in Globals.CONF["pages"][page]: continue

					# Allow pages only with "GET" methods
					if(
						"methods" in Globals.CONF["pages"][page] and
						"GET" not in Globals.CONF["pages"][page]["methods"]
					): continue

					# Allow pages that not require users to be logged in "unauthenticated"
					if(
						"authenticity_statuses" in Globals.CONF["pages"][page] and
						"unauthenticated" not in Globals.CONF["pages"][page]["authenticity_statuses"]
					): continue

					for endpoint in Globals.CONF["pages"][page].get("endpoints", []):
						# Create URL element
						url = ET.SubElement(urlset, "url")

						# Add location
						loc = ET.SubElement(url, "loc")

						# Remove trailing slash if both base_url and endpoint have it
						loc.text = f"{project_URL}{endpoint}"

						# Add last modified date
						lastmod = ET.SubElement(url, "lastmod")
						lastmod.text = today

						# Add change frequency
						changefreq = ET.SubElement(url, "changefreq")
						changefreq.text = "weekly"  # Default value, can be customized

						# Add priority
						priority = ET.SubElement(url, "priority")
						priority.text = "0.8"  # Default value, can be customized for different pages

				# Create the XML string with proper formatting
				XML_string = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="    ")

				File_System.create_file(f'{Globals.X_RUNNING_FROM}/www/static/sitemap.xml', XML_string, strict=True, overwrite=True)

			except Exception as e: Log.error(f"Sitemap.generate(): Could not generate sitemap.xml file: {e}")
