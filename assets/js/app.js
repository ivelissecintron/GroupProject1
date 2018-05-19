/* Psuedocode Area
Yvellise will be doing the front end 
Yulin the backend 
Jeff and Ryan will float in between both
We will attempt to replicate the Balsalmiq landing page.
Yulin will start the Yelp | Google Maps API keys.
Basic HTML is the goal.*/

// Execute this code when the DOM has fully loaded.
$(document).ready(function () {

    //Set global variables here
    var food = "";
    var place = "";
    var debug = false;
    var entrySubmit = true;
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCkMry5oUqqD4qjKSRNbW8G8fXlwOoWTQM",
        authDomain: "groupproject2-cb903.firebaseapp.com",
        databaseURL: "https://groupproject2-cb903.firebaseio.com",
        projectId: "groupproject2-cb903",
        storageBucket: "groupproject2-cb903.appspot.com",
        messagingSenderId: "28608108315"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var key = "";

    //Set the listner for submit click event
    $("#submit").on("click", function (event) {
        
        //Perform data validation
        var isValid = true;
        $('#formInput,#formFood').each(function () {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        });
        if (isValid == false)
            event.preventDefault();
        place = $("#formInput").val().trim();
        food = $("#formFood").val().trim();
        event.preventDefault();

        if (debug) {
            alert("I was clicked");
            console.log(food);
            console.log(place);
        }; //End Debug

        // Create the Query here by grabbing the place and food from the page
        var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + food + "&location=" + place + "&price=1" + "&limit=50";

        if (debug) {
            console.log(queryURL);
        }//End debug

        //Prefilter start
        jQuery.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }//End if
        });//End prefilter

        //Do function related to the Firebase DB
        if ((place.length == 0) || (food.length == 0)) {
        //No action.  
        }
        else {
            $("#formgroupcontainer").hide();
            addNewFB(queryURL);

            $.ajax({
                url: queryURL,
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + 'yF9IjWnaqJ3yRbhJnyBvBR9Kh2zBdrdaXwQysdRAeIK5PNgfHvGuNWBqF3eBbv6eFZ2HnbtHG6jUf6CXHioS30K6SjxwpMja_dWEcC_KRgoEAxwTGI8J3vCBL8ftWnYx' }
            }).then(function (response) {
                // Call the prependResults function to write the response
                if (debug) { console.log(response); }
                prependResults(response);

            });//End Ajax Call
        }
    }); //End of submit click

    function addNewFB(queryURL) {
        // Save the new data in Firebase
        database.ref().push({
            food: food,
            place: place,
            queryURL: queryURL,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });//End push    
    };//End updateFB
    //______________
    // Project listener to when new data is added to DB is here
    database.ref().orderByChild("dateAdded").limitToLast(15).on("child_added", function (childSnapshot) {
        food = childSnapshot.val().food;
        place = childSnapshot.val().place;
        queryURL = childSnapshot.val().queryURL;
        frequency = childSnapshot.val().frequency;
        dateAdded = childSnapshot.val().dateAdded;
        var key = childSnapshot.key;
        var strSearch = "";
        strSearch += place + ", ";
        strSearch += food + "\n"; //Needed to create a new row in the text area
        // Prepend the table row to the table body
        $("#recentSearches").prepend(strSearch);
    });//End ChildAdded 
    //_______________

    function prependResults(resp) {
        if (debug) { console.log(response); }
        //Perform for loop equal to length of the businesses array
        for (var i = 0; i < resp.businesses.length; i++) {
            let image = resp.businesses[i].image_url;
            let name = resp.businesses[i].name;
            let displayPhone = resp.businesses[i].display_phone;
            let rating = resp.businesses[i].rating;
            let latitude = resp.businesses[i].coordinates.latitude;
            let longitude = resp.businesses[i].coordinates.longitude;
            let phone = resp.businesses[i].phone;
            let address = resp.businesses[i].location.display_address;

            //Create the DOM HTML elements
            let restRow = $("<row>");
            let imgDiv = $("<div>");
            let restDiv = $("<div>").attr("class", "content-row");
            var restTd = $('<td>');
            let restAnchor = $("<a>");
            let restImage = $("<img>").attr('class', 'srcImg');

            var imgA = $('<a href="">');
            imgA.append(restImage);
            restTd.append(imgA);

            let p1 = $("<td>").html('<h1>'+ name + '<br>' + '</h1>');
            p1.append("<h3>" + displayPhone + "</h3>");
            restTd.append(restImage);
            let p3 = $("<td>").html('<h2>' + " Rating: " + '<p>'+  rating  + '<p>' + '</h2>');
            let p4 = $("<td>").html("<h4>" + " Address: " + address.toString()+ "</h4>");
            restImage.attr({"src": image});
            let p5 = $("<a>").text("View in Map");
            p5.attr("href", "#map");
            p5.attr({ "lat": latitude, "lon": longitude, "id": "goMap" });
            imgDiv.attr("class", "imgMeta");
            restDiv.append(
                restTd,
                p1,
                p3,
                p4, 
                p5);
            restRow.append(imgDiv, restDiv);
            $(".searchresults").prepend(restRow);
        }//end for loop
    }//End preprendResults function
});//End document.ready



// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


