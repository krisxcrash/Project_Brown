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

			for (var i = 0; i < results.length; i++) {

				//variables for prepending to window
				var eventTitle = results[i].name.text;
				var eventDescription = results[i].description.text;
				var startEvent = results[i].start.local;
				var endEvent = results[i].end.local;
				var eventImage = $("<img>");
				var venueName = results[i].venue.name;
				var venueLat = results[i].venue.latitude; // Unused
				var venueLon = results[i].venue.longitude; // Unused
				var venueAddress = results[i].venue.address.localized_address_display;
				var organizerName = results[i].organizer.name;

				//creates dynamic div for populating results
				var eventDiv = $("<div class='item col-md-4 col-sm-6 event-list'>");

				//prepends results to window
				if (results[i].logo === null) {
					eventDiv.append("<img src= https://placehold.it/400x200>");
					eventDiv.append("<h2 class= 'title'>" + eventTitle + "</h2>");
					eventDiv.append("<p class= 'description'>" + eventDescription + "</p>");
					eventDiv.append("<h5 class= 'times'>Start Time: </h5><p>" + startEvent + "</p>");
					eventDiv.append("<h5 class= 'times'>End Time: </h5><p>" + endEvent + "</p>");
					eventDiv.append("<h5>Organizer: </h5><h6>" + organizerName + "</h6>");
					eventDiv.append("<h5>Venue: </h5><h6>" + venueName + "</h6>");
					eventDiv.append("<h5>Address: </h5><h6>" + venueAddress + "</h6>");
					$(".events").prepend(eventDiv);
				}

				else {
					eventImage.attr("src", results[i].logo.url);
					eventDiv.append(eventImage);
					eventDiv.append("<h2 class= 'title'>" + eventTitle + "</h2>");
					eventDiv.append("<p class= 'description'>" + eventDescription + "</p>");
					eventDiv.append("<h5 class= 'times'>Start Time: </h5><p>" + startEvent + "</p>");
					eventDiv.append("<h5 class= 'times'>End Time: </h5><p>" + endEvent + "</p>");
					eventDiv.append("<h5>Organizer: </h5><h6>" + organizerName + "</h6>");
					eventDiv.append("<h5>Venue: </h5><h6>" + venueName + "</h6>");
					eventDiv.append("<h5>Address: </h5><h6>" + venueAddress + "</h6>");
					$(".events").prepend(eventDiv);
				};
			// console.log(response.location.augmented_location.city);
			// console.log(results[i].venue.name);
			};
		});

    // Clear form
    $('form').trigger("reset");
    // Toggles form by clicking "Search" panel header
    $(".toggle-form").click(function(){
		$(".toggle-form-container").slideDown("slow");
	});
});

// Calendar function for start/end dates
$(function() {
	$("#input-start").datepicker();
	$("#input-end").datepicker();
});
