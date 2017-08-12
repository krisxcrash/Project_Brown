// Revisions:
// 8/6 18:00 CJ - Updated current, simplified JS
// 8/6 19:00 CJ - Added comments, fixed Null images, retooled to "slightly" fit search-results.html
// 8/11 17:45 CJ - Removed unnecessary formatting, commented out some code (may re-use if time)

// 8/6 To DO: convert time values given to us, Re-implement form-toggling/hide on submit, search result pagination

// Currently not using Firebase - re-implement if necessary.
// var config = {
// 	apiKey: "AIzaSyDmBUkW-YBfdAME8Jo333BxYuj7FJ42K3M",
// 	authDomain: "the-event-network.firebaseapp.com",
// 	databaseURL: "https://the-event-network.firebaseio.com",
// 	projectId: "the-event-network",
// 	storageBucket: "the-event-network.appspot.com",
// 	messagingSenderId: "388370003060"
// };
// firebase.initializeApp(config);

// Global variables (might not be necessary)
var generalSearch = "";
var categorySearch = "";
var locationSearch = "";
var distanceSearch = 0;
var startDate = "";
var endDate = "";

// On submit button click, perform ajax call and main search/populating functions
$("#submit-button").on("click", function() {
	event.preventDefault();
	generalSearch = $("#input-general").val().trim();
	locationSearch = $("#input-location").val().trim();
	distanceSearch = parseInt($(".input-distance").val());
	startDate = $("#input-start").val();
	endDate = $("#input-end").val();

	// Hides form panel on submission -- unused as of 8/6. Needs re-implementation
	// $(".toggle-form-container").slideUp("slow");

	// Converts time from our calendar to UTC for queryURL
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
			// loop through JSON results to create unique variables/storage/populating HTML
			results.forEach(function(result) {
				// Saving JSON object results to variables
				var eventImageDiv = $("<img class='event-image-toggled'>");
				// var eventImage = result.logo.url;
				if (result.logo === null) {
					var eventImage = "https://placehold.it/400x200";
					eventImageDiv.attr("src", "https://placehold.it/400x200");
				}
				else {
					var eventImage = result.logo.url;
					eventImageDiv.attr("src", eventImage).attr("href", "eventpage.html");
				}
				var eventTitle = result.name.text;
				var eventDescription = result.description.text;
				var startEvent = result.start.local;
				var endEvent = result.end.local;
				var venueName = result.venue.name;
				var venueLat = parseInt(result.venue.latitude); // Unused
				var venueLon = parseInt(result.venue.longitude); // Unused
				var venueAddress = result.venue.address.localized_address_display;
				var organizerName = result.organizer.name;

				//converts time from UNIX ISO 8601 to MM/DD/YY hh:mm format
				var startEventConverted = moment(startEvent).format('MM/DD/YYYY hh:mm');
				var endEventConverted = moment(endEvent).format('MM/DD/YYYY hh:mm');

				//creates dynamic div for populating results
				var eventDiv = $("<tr class='toggle-form'>");

				eventDiv.append(eventImageDiv);
				eventDiv.append("<td class= 'table-data-format' width='600'>" + eventTitle + "</td>");
				eventDiv.append("<td class= 'table-data-format' width='150'>" + startEventConverted + "</td>");
				eventDiv.append("<td class= 'table-data-format' width='150'>" + endEventConverted + "</td>");
				eventDiv.append("<td class= 'table-data-format' width='300'>" + venueName + "</td>");
				$(".search-results").prepend(eventDiv);

				// When a result's div is clicked, that information is saved in localStorage to be passed onto event page
				eventDiv.on("click", function() {
					localStorage.setItem("title", eventTitle);
					localStorage.setItem("description", eventDescription);
					localStorage.setItem("eventstart", startEventConverted);
					localStorage.setItem("eventend", endEventConverted);
					localStorage.setItem("logo", eventImage);
					localStorage.setItem("venue", venueName);
					localStorage.setItem("latitude", venueLat);
					localStorage.setItem("longitude", venueLon);
					localStorage.setItem("address", venueAddress);
					localStorage.setItem("organizer", organizerName);
					eventImageDiv.slideToggle("slow");
				})
				eventImageDiv.on("click", function() {
					window.open("eventpage.html", "_blank");
				})
			})
		});
	// Clear form
	$("form").trigger("reset");
});

// jQuery UI datepicker
$(function() {
	var dateFormat = "mm/dd/yy",
		from = $("#input-start")
			.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 2,
				minDate:0
		})
		.on("change", function() {
			to.datepicker("option", "minDate", getDate(this));
		}),
		to = $("#input-end").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
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