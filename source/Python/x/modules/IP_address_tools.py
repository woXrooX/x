if __name__ != "__main__":
	def extract_IP_address_from_request(request):
		PROXY_HEADERS = [
			# The X-Forwarded-For (XFF) request header is a de-facto standard header for identifying the originating IP address of a client connecting to a web server through a proxy server.
			"X-Forwarded-For",

			"X-Real-IP",

			# Cloudflare
			"CF-Connecting-IP",

			"True-Client-IP"
		]

		# Check each proxy header
		for header in PROXY_HEADERS:
			if header in request.headers:
				# Get the first IP in case of multiple IPs in the header
				IP = request.headers[header].split(',')[0].strip()
				if IP: return IP

		# Fall back to remote_addr if no proxy headers found
		return request.remote_addr
