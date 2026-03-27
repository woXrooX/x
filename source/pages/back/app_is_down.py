from Python.x.modules.Page import Page

@Page.build({
	"enabled": True,
	"endpoints": ["/app_is_down"]
})
def app_is_down(): pass
