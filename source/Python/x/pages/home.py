from Python.x.modules.Page import Page

@Page.build({
	"enabled": True,
	"endpoints": ["/", "/home"]
})
def home(): pass
