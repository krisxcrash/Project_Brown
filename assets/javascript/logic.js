// Revisions:
// 8/6 18:00 CJ - Updated current, simplified JS

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDmBUkW-YBfdAME8Jo333BxYuj7FJ42K3M",
	authDomain: "the-event-network.firebaseapp.com",
	databaseURL: "https://the-event-network.firebaseio.com",
	projectId: "the-event-network",
	storageBucket: "the-event-network.appspot.com",
	messagingSenderId: "388370003060"
};
firebase.initializeApp(config);

var generalSearch = "";
var categorySearch = "";
var locationSearch = "";
var distanceSearch = 0;
var startDate = "";
var endDate = "";

$("#submit-button").on("click", function() {
	event.preventDefault();
	generalSearch = $("#input-general").val().trim();
	locationSearch = $("#input-location").val().trim();
	distanceSearch = parseInt($("#input-distance").val());
	startDate = $("#input-start").val();
	endDate = $("#input-end").val();

	// Hides form panel on submission
	$(".toggle-form-container").slideUp("slow");

	// Converts time from our calendar to UTC
	var convertedStart = moment.utc(startDate).format();
	var convertedEnd = moment.utc(endDate).format();

	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?token=PBMOFDBNG7TPGBUP7OSZ" + "&q=" + generalSearch + "&location.address=" + locationSearch + "&location.within=" + distanceSearch+"mi" + "&start_date.range_start=" + convertedStart + "&start_date.range_end=" + convertedEnd + "&expand=organizer,venue";
	$.ajax({
		url: queryURL,
		method: "GET"
		}).done(function(response) {
			console.log(response);
			var results = response.events;
			console.log(response.events);

			results.forEach(function(result) {
				//variables for prepending to window
				var eventTitle = result.name.text;
				var eventDescription = result.description.text;
				var startEvent = result.start.local;
				var endEvent = result.end.local;
				var eventImageDiv = $("<img>");
				var eventImage = result.logo.url;
				var venueName = result.venue.name;
				var venueLat = parseInt(result.venue.latitude); // Unused
				var venueLon = parseInt(result.venue.longitude); // Unused
				var venueAddress = result.venue.address.localized_address_display;
				var organizerName = result.organizer.name;

				//creates dynamic div for populating results
				var eventDiv = $("<div class='item col-md-4 col-sm-6 event-list'>");
					eventDiv.on("click", function() {
						sessionStorage.setItem("title", eventTitle);
						sessionStorage.setItem("description", eventDescription);
						sessionStorage.setItem("eventstart", startEvent);
						sessionStorage.setItem("eventend", endEvent);
						sessionStorage.setItem("logo", eventImage)
						sessionStorage.setItem("venue", venueName);
						sessionStorage.setItem("latitude", venueLat);
						sessionStorage.setItem("longitude", venueLon);
						sessionStorage.setItem("address", venueAddress);
						sessionStorage.setItem("organizer", organizerName);
					})
				if (result.logo === null) {
					eventDiv.append("<img src= https://placehold.it/400x200>");
				}
				else {
					eventImageDiv.attr("src", eventImage);
				}
				eventDiv.append(eventImageDiv);
				eventDiv.append("<h2 class= 'title'>" + eventTitle + "</h2>");
				eventDiv.append("<p class= 'description'>" + eventDescription + "</p>");
				eventDiv.append("<h5 class= 'times'>Start Time: </h5><p>" + startEvent + "</p>");
				eventDiv.append("<h5 class= 'times'>End Time: </h5><p>" + endEvent + "</p>");
				eventDiv.append("<h5>Organizer: </h5><h6>" + organizerName + "</h6>");
				eventDiv.append("<h5>Venue: </h5><h6>" + venueName + "</h6>");
				eventDiv.append("<h5>Address: </h5><h6>" + venueAddress + "</h6>");
				$(".events").prepend(eventDiv);
			})
		});
    // Clear form
    $('form').trigger("reset");
    // Toggles form by clicking "Search" panel header
 //    $(".toggle-form").click(function(){
	// 	$(".toggle-form-container").slideDown("slow");
	// });
});

$(function() {
	var dateFormat = "mm/dd/yy",
		from = $("#input-start")
			.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 2
		})
		.on("change", function() {
			to.datepicker("option", "minDate", getDate(this));
		}),
		to = $("#input-end").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 2
		})
		.on("change", function() {
			from.datepicker("option", "maxDate", getDate(this));
		});
 
	function getDate(element) {
		var date;
		try {
			date = $.datepicker.parseDate(dateFormat, element.value);
		} catch(error) {
			date = null;
		}
		return date;
	}
});


// function mapCreator() {
// 					map = google.maps.Map(document.getElementById('map'), {
// 						center: {lat: venueLat, lng: venueLon},
// 						zoom: 13
// 					});
// 				}