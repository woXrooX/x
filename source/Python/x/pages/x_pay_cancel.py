from Python.x.modules.Page import Page

@Page.build({
	"enabled": False,
	"methods": ["GET"],
	"endpoints": ["/x/pay/cancel"]
})
def x_pay_cancel(): pass
