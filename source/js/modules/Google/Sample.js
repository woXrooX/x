const map_styles = [
	{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#686868"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "all",
		"stylers": [
			{
				"color": "#f2f2f2"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "all",
		"stylers": [
			{
				"saturation": -100
			},
			{
				"lightness": 45
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"lightness": "-22"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"saturation": "11"
			},
			{
				"lightness": "-51"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text",
		"stylers": [
			{
				"saturation": "3"
			},
			{
				"lightness": "-56"
			},
			{
				"weight": "2.20"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"lightness": "-52"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"weight": "6.13"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.icon",
		"stylers": [
			{
				"lightness": "-10"
			},
			{
				"gamma": "0.94"
			},
			{
				"weight": "1.24"
			},
			{
				"saturation": "-100"
			},
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": "-16"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"saturation": "-41"
			},
			{
				"lightness": "-41"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"weight": "5.46"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"weight": "0.72"
			},
			{
				"lightness": "-16"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"lightness": "-37"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": [
			{
				"color": "#b7e4f4"
			},
			{
				"visibility": "on"
			}
		]
	}
];

const CONF = {
	// mapId: "HOME_MAP_ID", // Map ID is required for advanced markers.
	center: {
		lat: 54.255083,
		lng: -4.542858
	},
	zoom: 6,
	fullscreenControl: false, // Disable fullscreen control
	mapTypeControl: false, // Map/Satellite switcher
	zoomControl: false, // This removes the zoom control buttons
	streetViewControl: false, // This removes the Street View control button
	styles: map_styles
}

const marker_icon_styles = {
	// path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
	path: "M0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039zM0 4.5a3 3 0 1 0 0 6 3 3 0 1 0 0-6z",
	fillColor: CSS.getValue("--color-main"),
	fillOpacity: 0.9,
	strokeWeight: 0,
	rotation: 0,
	scale: 1.5,
	anchor: new google.maps.Point(0, 20),
};

