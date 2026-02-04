if __name__ != "__main__":
	import re
	from html.parser import HTMLParser
	from html import escape

	from main import render_template

	from Python.x.modules.Globals import Globals

	class HTML():
		########################### Static

		########### APIs

		@staticmethod
		def get_current_rendered_HTML(): return render_template("index.html", **globals())

		@staticmethod
		def set_tag_value(
			raw_HTML,
			tag,
			value
		):
			if not tag: return None

			new_value = escape(str(value), quote=False)

			# Non-greedy match for tag content; case-insensitive tag name
			pattern = re.compile(
				rf'(<{re.escape(tag)}\b[^>]*>)(.*?)(</{re.escape(tag)}\s*>)',
				flags=re.IGNORECASE | re.DOTALL
			)

			return pattern.sub(rf'\1{new_value}\3', raw_HTML, count=1)

		@staticmethod
		def set_attribute_value(
			raw_HTML,

			# Sample: <meta name="description"
			tag,

			# Attribute in the HTML tag
			attribute,

			# Value to be set to the attribute
			value
		):
			if not tag or not attribute: return None

			# Escape value for putting inside quotes
			escaped_value = escape(str(value), quote=True)

			# Find the full start tag that contains the marker, up to the closing ">"
			# (works for tags like <meta ...> including self-closing variants)
			tag_re = re.compile(rf'({re.escape(tag)}[^>]*)(>)', flags=re.IGNORECASE)

			def _rewrite(match):
				start, end = match.group(1), match.group(2)

				# If attribute exists, replace its value (handles " or ' quotes)
				attr_re = re.compile(
					rf'(\b{re.escape(attribute)}\s*=\s*)(["\']).*?\2',
					flags=re.IGNORECASE
				)

				if attr_re.search(start):
					start = attr_re.sub(rf'\1"{escaped_value}"', start, count=1)
					return start + end

				# Otherwise, insert attribute before closing >
				return start + f' {attribute}="{escaped_value}"' + end

			# Replace only the first matching tag
			return tag_re.sub(_rewrite, raw_HTML, count=1)
