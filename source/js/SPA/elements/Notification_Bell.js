export default class Notification_Bell extends HTMLElement {
	constructor(){
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<main>
				<x-svg name="notifications_bell"></x-svg>
				<span></span>
			</main>
			<style>
				:host{
					width: 1em;
					height: 1em;
					display: inline-block;
				}
				main{
					display: inline-grid;

					& > x-svg{
						grid-area: 1 / 1 / 2 / 2;
					}

					& > span{
						background-color: rgba(255, 0, 0, 0.7);

						color: white;
						font-size: 0.4em;
						text-align: center;

						padding: 3px;
						padding-top: 0;
						padding-bottom: 0;
						border-radius: 5px;

						grid-area: 1 / 1 / 2 / 2;
						justify-self: end;
						align-self: start;
					}
				}
			</style>
		`;

		this.addEventListener("click", ()=> window.Hyperlink.locate("/x/notifications"));

		this.#update_unseen_count_HTML();
	}

	async #update_unseen_count_HTML(){ this.shadowRoot.querySelector("main > span").innerHTML = window.x.Notification.unseen_count || ''; }
}

customElements.define('x-notification-bell', Notification_Bell);

window.x["Notification_Bell"] = Notification_Bell;
