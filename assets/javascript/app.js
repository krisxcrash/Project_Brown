	
//predefine results within 10 mile radius based on location chosen for event - returns restaurants, bars, and coffee shops
 var q = "restaurants";
 var loc = "irvine";

//on click function runs ajax call to pull yelp data out of node. 

$("#test").on("click", function() {
	var queryURL = 	"http://localhost:5000/yelp/?q=" + q + "&location=" + loc + "&radius=5mi&open_now=true" 

	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response) {
		var yelpResults = response.jsonBody.businesses;	

		for (var i = 0; i < yelpResults.length; i++) {
			var distanceMiles = Math.round((yelpResults[i].distance * 0.000621371192)*100)/100;

			console.log(yelpResults[i].location);

			var yelpDiv = $("<tr>")

			var yelpData = "<td>" + yelpResults[i].name + "</td><td>" + yelpResults[i].price + "</td><td>" + yelpResults[i].rating + "</td><td>" + yelpResults[i].display_phone + "</td><td>" + yelpResults[i].location.display_address + "</td><td>" + distanceMiles +"</td>";

			yelpDiv.append(yelpData);

			$(".results").append(yelpDiv);
		};
	});
});
