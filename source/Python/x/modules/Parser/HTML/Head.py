if __name__ != "__main__":
	from Python.x.modules.Parser.HTML.HTML import HTML

	class Head():
		########################### Static

		########### APIs

		@staticmethod
		def set_all(
			title = False,
			description = False
		):
			raw_HTML = HTML.get_current_rendered_HTML()

			if title is not False: raw_HTML = Head.set_title(raw_HTML, title)
			if description is not False: raw_HTML = Head.set_description(raw_HTML, description)

			return raw_HTML


		@staticmethod
		def set_title(raw_HTML, title):
			if not title: return raw_HTML

			# Apply to the three tags
			raw_HTML = HTML.set_tag_value(raw_HTML, "title", title)
			raw_HTML = HTML.set_attribute_value(raw_HTML, '<meta property="og:title"', "content", title)
			raw_HTML = HTML.set_attribute_value(raw_HTML, '<meta name="twitter:title"', "content", title)

			return raw_HTML

		@staticmethod
		def set_description(raw_HTML, description):
			if not description: return raw_HTML

			# Apply to the three tags
			raw_HTML = HTML.set_attribute_value(raw_HTML, '<meta name="description"', "content", description)
			raw_HTML = HTML.set_attribute_value(raw_HTML, '<meta property="og:description"', "content", description)
			raw_HTML = HTML.set_attribute_value(raw_HTML, '<meta name="twitter:description"', "content", description)

			return raw_HTML

