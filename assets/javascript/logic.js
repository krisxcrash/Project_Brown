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

	console.log(distanceSearch);

	// Converts time from our calendar to UTC
	var convertedStart = moment.utc(startDate).format();
	var convertedEnd = moment.utc(endDate).format();

	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?token=PBMOFDBNG7TPGBUP7OSZ" + "&q=" + generalSearch + "&location.address=" + locationSearch + "&location.within=" + distanceSearch+"mi" + "&start_date.range_start=" + convertedStart + "&start_date.range_end=" + convertedEnd;
	$.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
      	console.log(response);
    });
    // Clear form
    $('form').trigger("reset");
    // Toggles form by clicking "Search" panel header
    $(".toggle-form").click(function(){
		$(".toggle-form").slideToggle("slow");
	});
});

// Calendar function for start/end dates
$(function() {
	$("#input-start").datepicker();
	$("#input-end").datepicker();
});
