export default class Notification_Bell extends HTMLElement {
	constructor(){
		super();

		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
			<span>
				<x-svg name="notifications_bell"></x-svg>
				<span></span>
			</span>
			<style>
				:host{
					width: 1em;
					height: 1em;
					display: inline-block;
				}
				span{
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
		this.get_all_unseen_notifications();
	}

	async get_all_unseen_notifications (){
		let span_HTML = this.shadowRoot.querySelector("span > span");

		let notifications = await window.bridge({for: "get_all_unseen_notifications"}, "/x/notifications");
		if(!("data" in notifications)) return;
		notifications = notifications["data"];
		
		span_HTML.innerHTML = notifications[0]["unseen_notifications_count"];
	}
}

customElements.define('x-notification-bell', Notification_Bell);

window.x["Notification_Bell"] = Notification_Bell;
