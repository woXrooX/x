// <script src="https://js.stripe.com/v3/"></script>

export async function before(){
	window.x.Head.set_title("Pay");
}

export default function main(){
	return `
		<container class="max-width-1500px padding-5">
			<form id="x_payment_form" class="max-width-600px surface-v1 bg-white padding-2">
				<div id="x_payment_element" style="color:red;"></div>
				<button class="btn btn-primary">Pay now</button>
				<div id="x_payment_error_messages" class="text-color-error"></div>
			</form>
		</container>
	`;
}

export async function after(){
	await handle_payment_form();

	async function handle_payment_form(){
		const PK = await bridge({"for": "get_publishable_key"});
		if(!("data" in PK)) return console.log("Error: PK");

		const stripe = Stripe(PK["data"]);

		let response_data = await bridge({"for": "create_subscription"});
		if("data" in response_data) response_data = response_data["data"];
		else return;

		const elements = stripe.elements({"clientSecret": response_data["clientSecret"]});
		const payment_element = elements.create("payment");
		payment_element.mount("#x_payment_element");

		const form = document.getElementById("x_payment_form");
		form.addEventListener("submit", async ()=>{
			event.preventDefault();
			const {error} = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: window.location.origin + "/x/pay/success"
				}
			});

			if(error) document.getElementById("x_payment_error_messages").innerText = error.message;
		});
	}
}


