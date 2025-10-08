from Python.x.modules.Page import Page

@Page.build({
	"enabled": False,
	"methods": ["GET"],
	"endpoints": ["/x/pay/failure"]
})
def x_pay_failure(): pass
