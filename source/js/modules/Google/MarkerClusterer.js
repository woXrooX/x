export class MarkerClusterer{
	static #map_object = null;
	static #clusterer_object = null;
	static #markers = [];
	static #initialized = false;

	//// APIs
	static init(){
		return MarkerClusterer.#init_script();
	}

	static begin_clustering(map_object, markers){
		if(MarkerClusterer.#initialized !== true) return;
		MarkerClusterer.#clusterer_object = new markerClusterer.MarkerClusterer({markers: markers, map:  map_object});
	}

	static remove_all_markers(){
		if(MarkerClusterer.#initialized !== true) return;
		if(MarkerClusterer.#clusterer_object === null) return;
		MarkerClusterer.#clusterer_object.clearMarkers();
	}

	// static set_map(map = null){
	// 	if(MarkerClusterer.#initialized !== true) return;
	// 	if(MarkerClusterer.#clusterer_object === null) return;
	// 	MarkerClusterer.#clusterer_object.setMap(map);
	// }

	// static add_marker(marker){
	// 	if(MarkerClusterer.#initialized !== true) return;
	// 	MarkerClusterer.#clusterer_object.addMarker(marker);
	// }

	// static remove_marker(marker){
	// 	if(MarkerClusterer.#initialized !== true) return;
	// 	MarkerClusterer.#clusterer_object.removeMarker(marker);
	// }

	//// Helpers
	static #init_script(){
		if(MarkerClusterer.#initialized === true) return;

		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js`;
			script.onload = () =>{
				MarkerClusterer.#initialized = true;
				resolve();
			}
			script.onerror = () => reject(new Error('Failed to load the Google script'));

			// Below line should come after setting the onload and onerror event handlers.
			// This ensures that the handlers are in place before the script starts loading, so that they can properly handle the load and error events.
			window.document.head.appendChild(script);
		});
	}
}
