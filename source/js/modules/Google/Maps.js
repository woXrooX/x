//// CSS for removing certain parts
// .gm-style .gmnoprint, .gm-style .gmnoscreen {
// 	display: none;
// }
// div#map *{border: none !important;}

export class Maps{
	static #API_KEY;
	static #element = null;
	static map_object = null;
	static markers = [];
	static #initialized = false;

	static #CONF = {}

	//// APIs
	static init(API_KEY, element, CONF = {}){
		if(!!API_KEY === false) return Log.error("Google.Maps.init(): Invalid API_KEY argument!");
		if(!!element === false) return Log.error("Google.Maps.init(): Element does not exists!");

		Maps.#API_KEY = API_KEY;
		Maps.#element = element;
		Maps.#CONF = CONF;

		if(Maps.#initialized === true) return Maps.#init_Google_Maps_object();

		return Maps.#init_script();
	}

	static async put_marker(location_text, pin_styles = {}, title = null, info_window_content = null, on_click_exec_func = null){
		if(Maps.#initialized === false) return false;
		if(!!location_text === false || typeof location_text !== "string") return false;

		const geocode = await Maps.#text_to_geocode(location_text);

		const pin = new google.maps.marker.PinElement(pin_styles);

		const marker = new google.maps.marker.AdvancedMarkerElement({
			map: Maps.map_object,
			position: geocode,
			title: title,
			content: pin.element,
			// zIndex: 5,
			// collisionBehavior: "OPTIONAL_AND_HIDES_LOWER_PRIORITY",
		});

		// marker.setMap(Maps.map_object);

		if(info_window_content !== null){
			const infowindow = new google.maps.InfoWindow({
				content: info_window_content,
				ariaLabel: title,
			});

			const marker = new google.maps.Marker({
				position: geocode,
				map: Maps.map_object,
				title: title,
			});

			marker.addListener("click", ()=>{
				infowindow.open({
					anchor: marker,
					map: Maps.map_object,
				});

				if(on_click_exec_func !== null) on_click_exec_func();
			});
		}

		if(on_click_exec_func !== null) marker.addListener("click", on_click_exec_func);

		Maps.markers.push(marker);
	}

	static set_zoom(value){
		if(Maps.#initialized === false) return;
		if(typeof value !== "number") return;
		Maps.map_object.setZoom(value);
	}

	static set_center(value, zoom_value = null){
		if(Maps.#initialized === false) return;
		if(typeof value !== "object") return;
		Maps.map_object.setCenter(value, zoom_value);
	}

	// Remove marker by latitude, longitude
	static RMBLL(lat, lng){
		if (Maps.#initialized === false) return;

		for(let i = 0; i < Maps.markers.length; i++){
			const marker = Maps.markers[i];
			if(marker.getPosition().lat() === lat && marker.getPosition().lng() === lng){
				marker.setMap(null);
				Maps.markers.splice(i, 1);
				break;
			}
		}
	}

	static remove_all_markers(){
		if (Maps.#initialized === false) return;
		for(let i = 0; i < Maps.markers.length; i++) Maps.markers[i].setMap(null);
		Maps.markers = [];
	}

	//// Helpers
	static #init_script(){
		if(Maps.#initialized === true) return;

		window.google_maps_callback_func = Maps.#init_Google_Maps_object;

		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps.#API_KEY}&callback=google_maps_callback_func&v=beta&libraries=marker`;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load the Google script'));

			// Below line should come after setting the onload and onerror event handlers.
			// This ensures that the handlers are in place before the script starts loading, so that they can properly handle the load and error events.
			window.document.head.appendChild(script);
		});
	}

	static #init_Google_Maps_object(){
		Maps.map_object = new google.maps.Map(Maps.#element, Maps.#CONF);
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
}
