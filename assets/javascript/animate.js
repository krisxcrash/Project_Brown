// REVISIONS:
// 8/11 17:45 CJ Using file to populate and perform functions necessary for eventpage rather than logic.js
// 8/11 18:50 CJ created populate function to pull from local storage



// $('.form-floating-label input, .form-floating-label textarea').focusin(function(){
// 	$(this).parent().addClass('has-value');
// });

// $('.form-floating-label input, .form-floating-label textarea').blur(function(){
// 	if(!$(this).val().length > 0) {
// 		$(this).parent().removeClass('has-value');
// 	}
// });

// Set Variables
var title = localStorage.getItem("title");
var description = localStorage.getItem("description");
var eventStart = localStorage.getItem("eventstart");
var eventEnd = localStorage.getItem("eventend");
var logo = localStorage.getItem("logo");
var venue = localStorage.getItem("venue");
var latitude = localStorage.getItem("latitude");
var longitude = localStorage.getItem("longitude");
var address = localStorage.getItem("address");
var organizer = localStorage.getItem("organizer");

//
function populate() {
	$("#event-heading").html(title);
	$("#event-date").html("Start: " + eventStart + "</br>" + "End: " + eventEnd);
	$("#event-location").html(venue + "<br>" + address);
	$("#event-organizer").html(organizer);
}

populate();