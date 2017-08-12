// REVISIONS:
// 8/11 17:45 CJ Using file to populate and perform functions necessary for eventpage rather than logic.js
// 8/11 18:50 CJ created populate function to pull from local storage
// 8/11 20:20 CJ fixed node integration
// 8/12 00:05 CJ finalized map integration
// 8/12 1:25 KM updated event description in js

// Set Variables
var title = localStorage.getItem("title");
var description = localStorage.getItem("description");
var eventStart = localStorage.getItem("eventstart");
var eventEnd = localStorage.getItem("eventend");
var logo = localStorage.getItem("logo");
var venue = localStorage.getItem("venue");
var latitude = Number(localStorage.getItem("latitude"));
var longitude = Number(localStorage.getItem("longitude"));
var address = localStorage.getItem("address");
var organizer = localStorage.getItem("organizer");
var bigLogo = localStorage.getItem("biglogo");

// Variables for Yelp API
var q = "restaurants";
var loc = $(localStorage.getItem("address"));

// Populate event page HTML with object values in local storage
function populate() {
	$("#event-heading").html(title);
	$("#event-date").html("Start: " + eventStart + "</br>" + "End: " + eventEnd);
	$("#event-location").html(venue + "<br>" + address);
	$("#event-organizer").html(organizer);
	$("#event-description").html(description);
	if (bigLogo != "undefined") {
		$("#main-image").attr("src", bigLogo);
	}
}

// Yelp APi & Node.js
$(document).ready(function() {
	var queryURL = 	"https://pure-savannah-62932.herokuapp.com/yelp/?q=" + q + "&location=" + loc + "&radius=5mi&open_now=true";
	
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response) {
		var yelpResults = response.jsonBody.businesses;	
		console.log(yelpResults);
		for (var i = 0; i < yelpResults.length; i++) {
			var distanceMiles = Math.round((yelpResults[i].distance * 0.000621371192)*100)/100;
			console.log(yelpResults[i].location);
			var yelpDiv = $("<div class='items'>");
			var yelpData =  "<div class='image-resize-div'><img class='thumbnail image-resize' src='" + yelpResults[i].image_url + "' width='300'></div><h5><b>" + yelpResults[i].name + "</b></h5><p><b>Price:</b> " + yelpResults[i].price + "<br/><b>Rating:</b> " + yelpResults[i].rating + "/5<br/><b>Miles Away:</b> " + distanceMiles + "<br/><b>Phone:</b> " + yelpResults[i].display_phone +"</p><a href='" + yelpResults[i].url + "' class='button small expanded hollow yelp-link'>Take Me There</a>";
			// + yelpResults[i].display_phone + "</td><td>" + yelpResults[i].location.display_address + "</td><td>" + distanceMiles +"</td>";
			yelpDiv.append(yelpData);
			$(".results").append(yelpDiv);
		};
	});
});

// Google Map
function initMap() {
	var origin = {lat: latitude, lng: longitude};
	var infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	var map = new google.maps.Map(document.getElementById('map-div'), {
		zoom: 15,
		center: origin
	});
		var marker = new google.maps.Marker({
		position: origin,
		map: map,
		title: address
	});
	marker.addListener('click', function() {
		map.setZoom(17);
		map.setCenter(marker.getPosition());
		infowindow.setContent('<div><strong>Venue: ' + venue  + '</strong></br>' + address + '</strong></br>')
    		infowindow.open(map, this);
	});
	service.getDetails({
		placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
	}, function(place, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 'Place ID: ' + place.place_id + '<br>' + place.formatted_address + '</div>');
				infowindow.open(map, this);
			});
		}
	});
};

// 
populate();
initMap();