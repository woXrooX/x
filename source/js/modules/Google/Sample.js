const CONF = {
	mapId: "HOME_MAP_ID", // Map ID is required for advanced markers.
	center: {
		lat: 54.255083,
		lng: -4.542858
	},
	zoom: 6,
	fullscreenControl: false, // Disable fullscreen control
	mapTypeControl: false, // Map/Satellite switcher
	zoomControl: false, // This removes the zoom control buttons
	streetViewControl: false, // This removes the Street View control button
}


// Animations
// google.maps.Animation.DROP
// google.maps.Animation.BOUNCE

// Pin customs
// https://developers.google.com/maps/documentation/javascript/advanced-markers/basic-customization

const pin = new google.maps.marker.PinElement({
	scale: 1,
	background: "#FBBC04",
	borderColor: "#137333",
	glyphColor: "white",
	glyph: "", // Hide
});
