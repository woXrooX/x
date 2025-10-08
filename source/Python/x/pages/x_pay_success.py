from Python.x.modules.Page import Page

@Page.build({
	"enabled": False,
	"methods": ["GET"],
	"endpoints": ["/x/pay/success"]
})
def x_pay_success(): pass
