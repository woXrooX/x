import os
import re

from python.modules.Page import Page
from python.modules.response import response
from python.modules.Globals import Globals
from python.modules.Logger import Log

@Page.build()
def x_app_analytics(request):
	if request.method == "POST":
		if request.content_type == "application/json":
			if request.get_json()["for"] == "get_all_access_logs":
				if "URL" not in Globals.CONF["default"]: return response(type="error", message="invalid_request")

				log_file_and_path = f"/var/log/www.{Globals.CONF['default']['URL']['domain_name']}.{Globals.CONF['default']['URL']['domain_extension']}.access.log"

				if not os.path.exists(log_file_and_path):
					Log.warning(f"x_app_analytics -> File does not exists: {log_file_and_path}")
					return response(type="error", message="unknown_error")

				all_lines = []

				try:
					with open(log_file_and_path, 'r') as file:
						for line in file:
							parsed_line = parse_log_line(line.strip())
							if parsed_line is not None: all_lines.append(parsed_line)

				except Exception as e:
					Log.error(f"x_app_analytics -> {e}")
					return response(type="error", message="unknown_error")


				return response(type="success", message="success", data=all_lines, default_serializer_func=str)

def parse_log_line(line):
	pattern = r'(\S+) - - \[(.*?)\] "(.*?)" (\d+) (\d+) "(.*?)" "(.*?)" "(.*?)" response-time=([\d.]+)'
	match = re.match(pattern, line)
	if match:
		return [
			match.group(1), # IP address
			match.group(2), # Timestamp
			match.group(3), # HTTP method and path
			match.group(4), # Status code
			match.group(5), # Bytes sent
			match.group(6), # Referrer
			match.group(7), # User agent
			match.group(8), # Client IP (repeated)
			match.group(9)  # Response time
		]
	return None
