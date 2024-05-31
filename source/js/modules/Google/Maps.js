
export class Maps{
	static #API_KEY;
	static #element = null;
	static #map_object = null;
	static #markers = [];
	static #initialized = false;

	static #CONF = {}

	static init(API_KEY, element, CONF = {}){
		if(!!API_KEY === false) return Log.error("Google.Maps.init(): Invalid API_KEY argument!");
		if(!!element === false) return Log.error("Google.Maps.init(): Element does not exists!");

		Maps.#API_KEY = API_KEY;
		Maps.#element = element;
		Maps.#CONF = CONF;

		if(Maps.#initialized === true) return Maps.#init_Google_Maps_object();

		Maps.#init_script();
	}

	//// Helpers
	static #init_script(){
		if(Maps.#initialized === true) return;

		window.google_maps_callback_func = Maps.#init_Google_Maps_object;

		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps.#API_KEY}&callback=google_maps_callback_func&libraries=marker`;
		script.type = "module";
		window.document.head.appendChild(script);
		script.onerror = ()=>{ Log.error("Failed to load Google Maps script."); };
	}

	static #init_Google_Maps_object(){
		Maps.#map_object = new google.maps.Map(Maps.#element, Maps.#CONF);
		Maps.#initialized = true;
	}

	static #text_to_geocode(text){
		return new Promise((resolve, reject) => {
			const geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'address': text }, (results, status) => {
				if(status === 'OK') resolve({
					lat: results[0].geometry.location.lat(),
					lng: results[0].geometry.location.lng()
				});
				else reject('Geocode was not successful for the following reason: ' + status);
			});
		});
	}

	//// APIs
	static async put_marker(location_text, icon_styles = null, title = null){
		if(Maps.#initialized === false) return false;
		if(!!location_text === false || typeof location_text !== "string") return false;

		const geocode = await Maps.#text_to_geocode(location_text);

		const marker = new google.maps.Marker({
			position: geocode,
			map: Maps.#map_object,
			icon: icon_styles,
			title: title
		});

		Maps.#markers.push(marker);
	}

	static remove_marker(lat, lng){
		if (Maps.#initialized === false) return;

		for(let i = 0; i < Maps.#markers.length; i++){
			const marker = Maps.#markers[i];
			if(marker.getPosition().lat() === lat && marker.getPosition().lng() === lng){
				marker.setMap(null);
				Maps.#markers.splice(i, 1);
				break;
			}
		}
	}

	static remove_all_markers() {
		if (Maps.#initialized === false) return;
		for(let i = 0; i < Maps.#markers.length; i++) Maps.#markers[i].setMap(null);
	}
}
