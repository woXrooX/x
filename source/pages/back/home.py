from Python.x.modules.Page import Page

@Page.build({
	"enabled": True,
	"endpoints": ["/", "/home"],
	"has_SSR_HTML": False
})
def home(): pass
