//Step 1: Define functions, objects and variables

function displayError(message) {
    $("#messageBox span").html(message);
    $("#messageBox").fadeIn();
    $("#messageBox").fadeOut(4000);
};

//Execute Collpsible
function executeCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            $('.event-joining p').show();
            $('.event-joining .join-event-button').show();
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

//Initialize GMAP
let map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 45.52,
            lng: -122.681944
        },
        zoom: 13,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
    });


}

//Map Function to show events

function showMapEvents(events) {
    let userLat = $("#loggedInUserId").data("lat");
    let userLng = $("#loggedInUserId").data("lng");
    //console.log("Inside showmapevent");
    var bounds = new google.maps.LatLngBounds();
    //console.log(events.length);
    for (let i = 0; i < events.length; i++) {

        position = new google.maps.LatLng(events[i].lat, events[i].lng);
        //console.log(events[i].lat);
        marker = new google.maps.Marker({
            position: position,
            map: map
        });

        bounds.extend(new google.maps.LatLng(userLat, userLng))
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                // console.log("info fn");
                infowindow.setContent(`<h3>${events[i].eventTitle}</h3>`);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
    map.fitBounds(bounds);
    map.setZoom(10);

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

}

//Use Autocomplete to fill address

var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementsByClassName('autocomplete')[0]), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
        //console.log(document.getElementsByClassName(component));
        // console.log(document.getElementsByClassName(component)[0]);
        document.getElementsByClassName(component).value = '';
        document.getElementsByClassName(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementsByClassName(addressType)[0].value = val;
        }
        document.getElementById('eventStreetAddress').value =
            place.address_components[0]['long_name'] + ' ' +
            place.address_components[1]['long_name'];
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


function getLatLong(address) {
    return new Promise((resolve) => {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: 'AIzaSyDY5Mo1gHwOkP3SgAVQwrlCOP_lVVvtJDg'
                }
            })
            .then(function (response) {
                console.log(response);
                let latLong = [response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng];
                resolve(latLong);

            })
            .catch(function (error) {
                console.log(error);
                resolve();
            });
    })

}

function getUserLatLong() {
    let userLat, userLng;
    if (navigator.geolocation) {
        console.log("running");
        navigator.geolocation.getCurrentPosition(showPosition, showError);

    } else {
        displayError("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        console.log("running");
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        map.setCenter({
            lat: userLat,
            lng: userLng
        });
        //map.center.lat = userLat;
        //map.center.lng = userLng;
        console.log(userLat, userLng);
        $("#loggedInUserId").data("lat", userLat);
        $("#loggedInUserId").data("lng", userLng);
        showEventsNearUser(userLat, userLng);
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                displayError("Cannot procced without location access");
                break;
            case error.POSITION_UNAVAILABLE:
                displayError("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                displayError("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                displayError("An unknown error occurred.");
                break;
        }
    }

}

function showEventsNearUser(userLat, userLng) {
    //console.log(userLat, userLng);
    //make the api call to get all events based on GPS
    $.ajax({
            type: 'GET',
            url: 'https://anybuddy-full-stack-capstone.herokuapp.com/events/get/' + userLat + '/' + userLng,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);
            let loggedInUser = $('#loggedInUserId').val();

            let checkOwnEvents = result.events.filter(function findOwnEvents(val) {
                return !(val.ownerId == loggedInUser)
            });
            //console.log(checkOwnEvents);
            let checkUserEntry = checkOwnEvents.filter(function checkUser(event) {

                let checkPartnerEntry = event.partners.filter(function checkPartner(partner) {
                    return partner.partnerId == loggedInUser;
                })
                return (checkPartnerEntry.length) === 0;
            });
            //Filter events to check if required partners > 0
            let validEvents = checkUserEntry.filter(function checkVal(val) {
                return (val.partnersRequired) > 0
            });
            if (validEvents.length === 0) {
                displayError("No events to show")
                $('main').hide();
                $('.my-events-page').hide();
                $('.no-events-text').show();
                $('.nearby-events-page').show();
                $('.menu-page').show();
            } else {
                let buildTheHtmlOutput = "";

                $.each(validEvents, function (resultKey, resultValue) {
                    buildTheHtmlOutput += `<li data-eventid=${resultValue._id} data-ownerid=${resultValue.ownerId}>`;
                    buildTheHtmlOutput += `<div class="event-content collapsible">
<h3 class="event-header">${resultValue.eventTitle}</h3>
<h4 class="event-date">${resultValue.eventDate.slice(0,10)}, ${resultValue.eventTime}</h4>
<h5 class="event-address">${resultValue.eventStreetAddress}, ${resultValue.eventCity}</h5>
</div>`;
                    buildTheHtmlOutput += `<div class="event-joining collapse-content">
<p>Partners Required: <span class="required-partners">${resultValue.partnersRequired}</span></p>
<button class="join-event-button">Join Event</button>
<div class="request-join-details">
<form class="request-join-form" data-eventid=${resultValue._id} data-partnernumber=${resultValue.partnersRequired}>
<fieldset name="contact-info" class="contact-info">

<label for="contactName">Name</label>
<input role="textbox" type="text" name="contactName" class="partnerName" required>

<label for="contactEmail">Email</label>
<input role="textbox" placeholder="foo@bar.com" type="email" name="contactemail" class="partnerEmail" required>

<label for="contactNumber">Phone</label>
<input role="textbox" type="tel" name="contactnumber" class="partnerPhone" required>

<button role="button" type="submit" class="request-joining-button">Join</button>

</fieldset>

</form>
</div>
</div>`;
                    buildTheHtmlOutput += `</li>`;
                })
                //use the HTML output to show
                $(`.nearby-events-page .events-list`).html(buildTheHtmlOutput);
                executeCollapsible();
                showMapEvents(validEvents);
                //console.log("After showmap");
                $('main').hide();
                $('.my-events-page').hide();
                $('.nearby-events-page').show();
                $('.menu-page').show();
            }

            $("#messageBox").hide();
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function reducePartnersRequiredCount(eventId, partnersRequired) {

    let actualPartners = partnersRequired - 1;
    const newEventObject = {
        id: eventId,
        partnersRequired: actualPartners
    };
    $.ajax({
            type: 'PUT',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/event/${eventId}`,
            dataType: 'json',
            data: JSON.stringify(newEventObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function increasePartnersRequiredCount(eventId, partnersRequired) {

    let actualPartners = partnersRequired + 1;
    const newEventObject = {
        id: eventId,
        partnersRequired: actualPartners
    };
    $.ajax({
            type: 'PUT',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/event/${eventId}`,
            dataType: 'json',
            data: JSON.stringify(newEventObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function showMyOwnEvents(userId) {
    $.ajax({
            type: 'GET',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/events/get/all/${userId}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result);
            //console.log(result.eventsOutput);

            let buildTheHtmlOutput = "";

            $.each(result.eventsOutput, function (resultKey, resultValue) {

                let owner = this.ownerId;
                let checkPartners = this.partners.filter(function filterPartner(val) {
                    return !(val.partnerId == owner)
                });

                let buildPartnerList = ``;
                $.each(checkPartners, function (resultKey, resultValue) {
                    buildPartnerList += `<li>
<button class="collapsible contact-collapse">${resultValue.partnerName}</button>
<div class="collapse-content contact-collapse-content">
<p>Email: <span>${resultValue.partnerEmail}</span></p>
<p>Phone: <span>${resultValue.partnerPhone}</span></p>
</div>
</li>`
                })
                buildTheHtmlOutput += `<li class="creator-single-event-display" data-eventid=${resultValue._id}>`;
                //console.log(resultKey, resultValue);
                buildTheHtmlOutput += `<div class="event-update-buttons">
<button class="edit-event-button">Edit</button>
<span>|</span>
<button class="delete-event-button">Delete</button>
</div>`;
                buildTheHtmlOutput += `<div class="single-event-info">
<h3>${resultValue.eventTitle}</h3>
<h4>Date</h4>
<p>${resultValue.eventDate.slice(0,10)}, ${resultValue.eventTime}</p>
<h4>Location</h4>
<p>${resultValue.eventStreetAddress}, ${resultValue.eventCity}</p>
</div>`;
                buildTheHtmlOutput += `<div class="collapse-button">
<button class="collapsible" data-partnernumber=${checkPartners.length}>My Partners</button>
<ul class="collapse-content">
${buildPartnerList}
</ul>
</div>`;
                buildTheHtmlOutput += `<div class="edit-event-container">
<form class="edit-event-form">
<h2 class="event-details-text">Edit Event</h2>
<fieldset name="event-info" class="event-info">

<label for="eventTitle">Event Title</label>
<input role="textbox" type="text" name="title" class="editEventTitle" value="${resultValue.eventTitle}" required="">

<label for="eventDate">Date</label>
<input type="date" name="date" class="editEventDate" value="${resultValue.eventDate.slice(0,10)}" required="">

<label for="eventTime">Time</label>
<input type="time" name="time" class="editEventTime" value="${resultValue.eventTime}" required="">

</fieldset>

<button role="button" type="submit" class="save-event-button">Save</button>
</form>
</div>`;
                buildTheHtmlOutput += `<div class="delete-event-container">
<p>Removing <span class="delete-event-name">${resultValue.eventTitle}</span></p>
<p>The event will be permanently deleted.</p>
<button role="button" class="remove-my-event-button">Delete</button>
</div>`;
                buildTheHtmlOutput += `</li>`;

            })
            //use the HTML output to show
            $(`.my-events-page .self-view-display .self-view-display-list`).html(buildTheHtmlOutput);
            $('.filter-events').val("0");
            $('.edit-event-container').hide();
            $('.delete-event-container').hide();
            $('.others-view-display').hide();
            $('.self-view-display').show();
            executeCollapsible();

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}

function showJoinedEvents(userId) {

    let user = $("#loggedInUserId").val();

    $.ajax({
            type: 'GET',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/events/get/all/joined/${userId}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result);
            console.log(result.checkUserEntry.length);
            if (result.checkUserEntry.length == 0) {
                console.log(result.checkUserEntry.length);
                displayError("You have not joined any event")
                // $(`.my-events-page .others-view-display .others-view-display-list`).html(buildTheHtmlOutput);
                $('.filter-events').val("1");
                $('.delete-event-container').hide();
                $('.others-view-display').show();
                $('.my-events-list-container').show();
                $('.my-events-page').show();
                $('.menu-page').show();
            } else {
                let buildTheHtmlOutput = ``;
                $.each(result.checkUserEntry, function (resultKey, resultValue) {
                    let checkPartners = this.partners.filter(function filterPartner(val) {
                        return !(val.partnerId == user)
                    });

                    let buildPartnerList = ``;
                    $.each(checkPartners, function (resultKey, resultValue) {
                        buildPartnerList += `<li data-partnerid=${resultValue._id}>
<button class="collapsible contact-collapse">${resultValue.partnerName}</button>
<div class="collapse-content contact-collapse-content">
<p>Email: <span>${resultValue.partnerEmail}</span></p>
<p>Phone: <span>${resultValue.partnerPhone}</span></p>
</div>
</li>`
                    })
                    buildTheHtmlOutput += `<li class="partner-single-event-display" data-eventid=${resultValue._id}>`;
                    //console.log(resultKey, resultValue);
                    buildTheHtmlOutput += `<div class="event-update-buttons">
<button class="delete-event-button">Remove</button>
</div>`;
                    buildTheHtmlOutput += `<div class="single-event-info">
<h3>${resultValue.eventTitle}</h3>
<h4>Date</h4>
<p>${resultValue.eventDate.slice(0,10)}, ${resultValue.eventTime}</p>
<h4>Location</h4>
<p>${resultValue.eventStreetAddress}, ${resultValue.eventCity}</p>
</div>`;
                    buildTheHtmlOutput += `<div class="collapse-button">
<button class="collapsible">My Partners</button>
<ul class="collapse-content">
${buildPartnerList}
</ul>
</div>`;
                    buildTheHtmlOutput += `<div class="delete-event-container" data-partnernumber=${resultValue.partnersRequired}>
<p>You will be removed as a partner</p>
<button role="button" class="remove-event-button">Remove</button>
</div>`;
                    buildTheHtmlOutput += `</li>`;

                })

                //use the HTML output to show
                $(`.my-events-page .others-view-display .others-view-display-list`).html(buildTheHtmlOutput);
                $('.filter-events').val("1");
                $('.delete-event-container').hide();
                $('.others-view-display').show();
                $('.my-events-list-container').show();
                $('.my-events-page').show();
                $('.menu-page').show();
                executeCollapsible();
            }

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}

//Change event for dynamic dropdowns
$(document).on('change', '.filter-events', function (event) {
    let userId = $("#loggedInUserId").val();
    var selectedValue = $('.filter-events option:selected').val();
    console.log(selectedValue);
    if (selectedValue == 0) {
        $('.others-view-display').hide();
        showMyOwnEvents(userId);
    } else {
        $('main').hide();
        $('.nearby-events-page').hide();
        $('.create-event-container').hide();
        $('.no-events-text').hide();
        $('.self-view-display').hide();
        $(this).find('.delete-event-container').hide();
        showJoinedEvents(userId);
    }
});

//Step 2: Use functions, objects and variables(Triggers)

$(document).ready(function () {
    executeCollapsible();
    $("#messageBox").hide();
    $('main').hide();
    $('.log-in-container').hide();
    $('.register-container').hide();
    //$(handleMenuButtonClicks);
    $('.welcome-page').show();
});

//button triggers
$(document).on('click', '#logInButton', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.register-container').hide();
    $('.features-container').hide();
    $('.info-text').hide();
    $('.log-in-container').show();
    $('.welcome-page').show();
});

$(document).on('click', '.logout-button', function (event) {
    location.reload();
});


$(document).on('click', '.register-link', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.log-in-container').hide();
    $('.features-container').hide();
    $('.info-text').hide();
    $('.info-text').hide();
    $('.register-link').hide();
    $('.register-container').show();
    $('.welcome-page').show();
});


$(document).on('click', '.my-events-button', function (event) {
    event.preventDefault();
    const targetButton = $('.my-events-button');
    const otherButtons = $('.subnav button').not(targetButton);
    otherButtons.removeClass('js-menu-button');
    targetButton.addClass('js-menu-button');
    let userId = $("#loggedInUserId").val();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.no-events-text').hide();
    $('.others-view-display').hide();
    $(this).find('.edit-event-container').hide();
    $(this).find('.delete-event-container').hide();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();
    $('.filter-events').val("0");
    showMyOwnEvents(userId);
});

$(document).on('click', '.nearby-events-button', function (event) {
    event.preventDefault();
    const targetButton = $('.nearby-events-button');
    const otherButtons = $('.subnav button').not(targetButton);
    otherButtons.removeClass('js-menu-button');
    targetButton.addClass('js-menu-button');
    let userLat = $("#loggedInUserId").data("lat");
    let userLng = $("#loggedInUserId").data("lng");
    $('main').hide();
    $('.my-events-page').hide();
    $('.nearby-events-page').show();
    $('.menu-page').show();
    showEventsNearUser(userLat, userLng);
});

$(document).on('click', '.event-content', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.my-events-page').hide();
    $('.request-join-form').hide();
    $('.nearby-events-page').show();
    $('.menu-page').show();
});

$(document).on('click', '.join-event-button', function (event) {
    event.preventDefault();

    let ownerId = $(this).closest('li').data('ownerid');
    let userId = $('#loggedInUserId').val();
    //console.log(ownerId);
    //console.log(userId);
    if (ownerId == userId) {
        alert("You cannot join your own event");
    } else {

        $('main').hide();
        $('.my-events-page').hide();
        $('.event-joining p').hide();
        $('.event-joining .join-event-button').hide();
        $('.request-join-form').show();
        $('.nearby-events-page').show();
        $('.menu-page').show();
    }
});

$(document).on('click', '.new-event-button', function (event) {
    event.preventDefault();
    initAutocomplete();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.my-events-list-container').hide();
    $('.create-event-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();

});

$(document).on('click', '.my-events-main-content button:contains("My Partners")', function (event) {
    event.preventDefault();
    let partnerNumber = $(this).data('partnernumber');

    if (partnerNumber == 0) {
        displayError("No partners");
    }
});

$(document).on('click', '.edit-event-button', function (event) {
    event.preventDefault();
    let eventId = $(this).closest('li').data('eventid');
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.delete-event-container').hide();
    $(`li[data-eventid=${eventId}] .edit-event-container`).show();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();


});

$(document).on('click', '.event-update-buttons .delete-event-button', function (event) {
    event.preventDefault();
    let eventId = $(this).closest('li').data('eventid');
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.edit-event-container').hide();
    $(`li[data-eventid=${eventId}] .delete-event-container`).show();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();

});

$(document).on('click', '.remove-my-event-button', function (event) {
    event.preventDefault();

    $(this).closest('li').hide();
    let eventId = $(this).closest('li').data('eventid');
    let userId = $("#loggedInUserId").val();

    $.ajax({
            type: 'DELETE',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/event/${eventId}`,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            displayError("deleted event");
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});

$(document).on('click', '.remove-event-button', function (event) {
    $(this).closest('li').hide();
    event.preventDefault();

    let eventInfo = $(this).closest('li').data('eventid');
    let requiredPartners = $(this).closest('.delete-event-container').data('partnernumber');
    console.log(requiredPartners);
    let userId = $("#loggedInUserId").val();

    let editPartnerRequest = {
        eventId: eventInfo
    }

    $.ajax({
            type: 'PUT',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/event/partner/remove/${eventInfo}/${userId}`,
            dataType: 'json',
            data: JSON.stringify(editPartnerRequest),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            displayError("Event removed succesfully");
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
    increasePartnersRequiredCount(eventInfo, requiredPartners);
    //showJoinedEvents(userId);
});

//Form Triggers

$('.login-form').submit(function (event) {
    event.preventDefault();
    $("#messageBox").show();
    //take the input from the user
    const username = $("#loginUserName").val();
    const password = $("#loginPassword").val();

    //validate the input
    if (username == "") {
        displayError('Please input user name');
    } else if (password == "") {
        displayError('Please input password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const loginUserObject = {
            username: username,
            password: password
        };
        //console.log(loginUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: 'https://anybuddy-full-stack-capstone.herokuapp.com/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('main').hide();
                $('.my-events-page').hide();
                $('.username').text(result.username);
                $('#loggedInUserId').val(result._id);

                getUserLatLong();
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                displayError('Incorrect Username or Password');
            });
    };
});

$('.register-form').submit(function (event) {
    event.preventDefault();

    //take the input from the user
    const email = $("#registerEmail").val();
    const username = $("#registerUserName").val();
    const password = $("#registerPassword").val();

    //validate the input
    if (email == "") {
        displayError('Please add an email');
    } else if (username == "") {
        displayError('Please add a user name');
    } else if (password == "") {
        displayError('Please add a password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newUserObject = {
            email: email,
            username: username,
            password: password
        };

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: 'https://anybuddy-full-stack-capstone.herokuapp.com/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('main').hide();
                $('.my-events-page').hide();
                $('.menu-page').show();
                $('.username').text(result.username);
                $('#loggedInUserId').val(result._id);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };

});

$(document).on('submit', '.request-join-form', function (event) {
    event.preventDefault();
    let requiredPartners = $(this).data('partnernumber');

    let eventId = $(this).closest('li').data('eventid');
    let partnerId = $('#loggedInUserId').val();
    let partnerName = $(".partnerName").val();
    let partnerEmail = $(".partnerEmail").val();
    let partnerPhone = $(".partnerPhone").val();
    let partnerStatus = "Awaiting response";

    const newEventObject = {
        id: eventId,
        partners: [{
            partnerId: partnerId,
            partnerName: partnerName,
            partnerEmail: partnerEmail,
            partnerPhone: partnerPhone,
            partnerStatus: partnerStatus
        }]
    };
    //console.log(JSON.stringify(newEventObject));
    $.ajax({
            type: 'PUT',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/event/partner/add/${eventId}`,
            dataType: 'json',
            data: JSON.stringify(newEventObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            //console.log(result);
            $(".partnerName").val("");
            $(".partnerEmail").val("");
            $(".partnerPhone").val("");
            displayError("Event created succesfully");
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
    $(this).closest('li').hide();
    let userLat = $("#loggedInUserId").data("lat");
    let userLng = $("#loggedInUserId").data("lng");
    reducePartnersRequiredCount(eventId, requiredPartners);
    //showEventsNearUser(userLat, userLng);
    $('main').hide();
    $('.my-events-page').hide();
    $('.event-joining').hide();
    $('.nearby-events-page').show();
    $('.menu-page').show();
});


$('.create-event-form').submit(function (event) {
    event.preventDefault();
    //take the input from the user
    const ownerId = $('#loggedInUserId').val();
    const ownerName = $("#contactName").val();
    const ownerEmail = $("#contactEmail").val();
    const ownerPhone = $("#contactNumber").val();
    const eventTitle = $("#eventTitle").val();
    const eventDate = $("#eventDate").val();
    const eventTime = $("#eventTime").val();
    const eventStreetAddress = $("#eventStreetAddress").val();
    const eventCity = $("#eventCity").val();
    const eventState = $("#eventState").val();
    const eventZipcode = $("#eventZipCode").val();
    const eventCountry = $("#eventCountry").val();
    const partnersRequired = $("#requiredPartners").val();
    const partnerId = ownerId;
    const partnerName = $("#contactName").val();
    const partnerEmail = $("#contactEmail").val();
    const partnerPhone = $("#contactNumber").val();
    const partnerStatus = "Approved";
    const creationDate = new Date();

    //validate the input
    if (eventTitle == "") {
        displayError('Please add event title');
    } else {
        let lat, lng;
        let adddressString = `${eventStreetAddress} ${eventCity} ${eventState}`;
        getLatLong(adddressString).then((result) => {
            console.log(result);
            lat = result[0];
            lng = result[1];

            //create the payload object (what data we send to the api call)
            const newEventObject = {
                ownerId: ownerId,
                ownerName: ownerName,
                ownerEmail: ownerEmail,
                ownerPhone: ownerPhone,
                eventTitle: eventTitle,
                eventDate: eventDate,
                eventTime: eventTime,
                eventStreetAddress: eventStreetAddress,
                eventCity: eventCity,
                eventState: eventState,
                eventZipcode: eventZipcode,
                eventCountry: eventCountry,
                lat: lat,
                lng: lng,
                partnersRequired: partnersRequired,
                partners: {
                    partnerId: partnerId,
                    partnerName: partnerName,
                    partnerEmail: partnerEmail,
                    partnerPhone: partnerPhone,
                    partnerStatus: partnerStatus
                }
            };
            //console.log(newEventObject);

            //make the api call using the payload above
            $.ajax({
                    type: 'POST',
                    url: 'https://anybuddy-full-stack-capstone.herokuapp.com/events/create',
                    dataType: 'json',
                    data: JSON.stringify(newEventObject),
                    contentType: 'application/json'
                })
                //if call is succefull
                .done(function (result) {
                    console.log(result);
                    $("#eventTitle").val("");
                    $("#eventDate").val("");
                    $("#eventTime").val("");
                    $("#eventStreetAddress").val("");
                    $("#eventCity").val("");
                    $("#eventState").val("");
                    $("#eventZipCode").val("");
                    $("#eventCountry").val("");
                    $("#contactName").val("");
                    $("#contactEmail").val("");
                    $("#contactNumber").val("");
                    $("#requiredPartners").val("");
                    $('.create-event-container').hide();
                    $('.my-events-list-container').show();
                    showMyOwnEvents(ownerId);
                    displayError("Event created succesfully");
                })
                //if the call is failing
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        });
    };

});

$(document).on('submit', '.edit-event-form', function (event) {
    event.preventDefault();

    let userId = $("#loggedInUserId").val();
    const eventTitle = $(this).find(".editEventTitle").val();
    const eventDate = $(this).find(".editEventDate").val();
    const eventTime = $(this).find(".editEventTime").val();

    let eventId = $(this).closest('li').data('eventid');

    const editEventObject = {
        id: eventId,
        eventTitle: eventTitle,
        eventDate: eventDate,
        eventTime: eventTime
    };
    $.ajax({
            type: 'PUT',
            url: `https://anybuddy-full-stack-capstone.herokuapp.com/event/${eventId}`,
            dataType: 'json',
            data: JSON.stringify(editEventObject),
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            //console.log(result);
            displayError("Event edited succesfully");
            showMyOwnEvents(userId);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});
