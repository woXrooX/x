if __name__ != "__main__":
	from Python.x.modules.Logger import Log

	class Product:
		one_time_products = {
			"sample_one": {
				"amount": 1000,
				"currency": "usd"
			}
		}

		subscription_products = {
			"PRO_MONTHLY": {
				"price_id": "price_...",
				"amount": 10000,
				"currency": "gbp"
			}
		}
