"use strict";

const stripe = Stripe('pk_test_51Kr4zpAh3t85mIMGcpGTyCesktRL3wdpQZATQp0q8dTJXBjdOggQADHZaEgM2D2XcbKbFCTELj9wjtEuW5nEwPHe00lh4kxZbP');

const button = document.querySelector('#btn');
button.addEventListener('click', event => {
    stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: 'cs_test_a1CStvjaARtxlAiZWZlenyuNCIN4wErKFw1EFQjtPi3TaA6QjOwxqNEpMm'
    }).then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
    });
})
