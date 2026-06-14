// station codes + names
const stations_list = ['CMB', 'KDY', 'JAF', 'GAL', 'TRI'];
const stations_name = ['Colombo', 'Kandy', 'Jaffna', 'Galle', 'Trincomalee'];

const code_to_name = {
    'CMB': 'Colombo',
    'KDY': 'Kandy',
    'JAF': 'Jaffna',
    'GAL': 'Galle',
    'TRI': 'Trincomalee'
};

const name_to_code = {
    'Colombo': 'CMB',
    'Kandy': 'KDY',
    'Jaffna': 'JAF',
    'Galle': 'GAL',
    'Trincomalee': 'TRI'
};

// price values per station 

const stationValues = {
    "Colombo": 20,
    "Kandy": 40,
    "Galle": 10,
    "Jaffna": 80,
    "Trincomalee": 60,
};

// get url params if coming from schedule page

const url_params = new URLSearchParams(window.location.search);
let route_from = url_params.get('from') || undefined;
let route_to = url_params.get('to') || undefined;
let initial_date = url_params.get('date') || undefined;
let initial_time = url_params.get('time') || undefined;

let full_trip_collection = [];

// booking page js (booking.html)

        function pricecal() {
            let start = document.getElementById("start").value;
            let end = document.getElementById("end").value;
            let seats = Number(document.getElementById("seats").value);
            
            let displayPrice = document.getElementById("priceDisplay");

            if (start !== "" && end !== "" && start !== end && seats > 0) {
                let startval = stationValues[start];
                let endval = stationValues[end];
                
                let difference = startval - endval;
                
                if (difference < 0) {
                    difference = difference * -1;
                }
                
                
                let totalPrice = difference * 50 * seats;
                
                displayPrice.innerHTML = "Total Price: Rs." + totalPrice ;
                
            } else if (start === end && start !== "") {
                displayPrice.innerHTML = "<span style='color:red;'>Departure and Destination cannot be the same!</span>";
            } else {
                displayPrice.innerHTML = "Total Price: Rs.";
            }
        }

        function booking(event) {
            event.preventDefault();

            try {
                let start = document.getElementById("start").value;
                let end = document.getElementById("end").value;
                let date = document.getElementById("date").value;
                let seats = Number(document.getElementById("seats").value); 
                let name = document.getElementById("pname").value;
                let nic = document.getElementById("nic").value;
                let mobile = document.getElementById("cnumber").value;

                if (start === end) {
                    throw new Error("Departure and Destination cannot be the same!");
                }
                else if (seats <= 0) {
                    throw new Error("You must book at least 1 seat.");
                }               
                else if (mobile.length < 10) {
                    throw new Error("Please enter a valid mobile number.");
                }

                let confirmMsg = "Please confirm your booking details!" ;
                                          
                                          
                let isconfirmed = confirm(confirmMsg);

                if (isconfirmed) {
                    alert("Success! Your tickets have been booked.");
                    document.getElementById("bookingForm").reset();

                    
                } else {
                    alert("Booking cancelled.");
                }
                
        

            } catch (e) {
                alert("Error: " + e.message);
            } finally {
                console.log("Booking attempt finished.");
            }
        }

// journey card popup (journey.html)

function showCardPopup(from_index, to_index) {
    route_from = stations_list[from_index];
    route_to = stations_list[to_index];

    let lookup_key = route_from + "_" + route_to;
    if (typeof sriLankaTrainTrips === 'undefined' || !sriLankaTrainTrips[lookup_key]) return;

    let targeted_trip = sriLankaTrainTrips[lookup_key];

    $('#route-origin').text(stations_name[from_index]);
    $('#route-destination').text(stations_name[to_index]);
    $('#route-direction').text(targeted_trip.direction);
    $('#route-vibe').text(`"${targeted_trip.vibe}"`);
    $('#route-description').text(targeted_trip.description);
    $('#route-highlights').text(targeted_trip.keyHighlights);

    $('#from-station-image').attr('src', `images/${route_from}.jpg`);
    $('#to-station-image').attr('src', `images/${route_to}.jpg`);

    $('#black-screen').removeClass('hidden');
    $('#journey-card').removeClass('hidden');
    $('body').addClass('hide-exec');
}

$('.card').click(function () {
    showCardPopup($(this).data('from'), $(this).data('to'));
});

$('#btn-select-route').click(function () {
    window.open(route_from && route_to ? `schedule.html?from=${route_from}&to=${route_to}` : 'schedule.html', '_self');
});

$('#black-screen').click(function () {
    $('#black-screen').addClass('hidden');
    $('#journey-card').addClass('hidden');
    $('body').removeClass('hide-exec');
});

// schedule table

function findActualDate(day_name) {
    const total_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const target_day = total_days.indexOf(day_name);
    if (target_day === -1) return day_name;

    const date_today = new Date();
    let day_delta = target_day - date_today.getDay();
    if (day_delta < 0) day_delta += 7;

    const date_result = new Date(date_today);
    date_result.setDate(date_today.getDate() + day_delta);

    return date_result.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function makeTrainSchedule() {
    full_trip_collection = [];
    if (typeof trainSchedule === 'undefined') return;

    Object.keys(trainSchedule).forEach(function(day) {
        const generated_date = findActualDate(day);
        trainSchedule[day].forEach(function(trip) {
            full_trip_collection.push({
                origin: trip.origin,
                destination: trip.destination,
                departure: trip.departure,
                actual_date: generated_date
            });
        });
    });
}

function makeFilterOptions() {
    if (full_trip_collection.length === 0 || !$('#origin-select').length) return;

    let unique_origins = [], unique_dests = [], seen_origins = {}, seen_dests = {};

    for (let index_i = 0; index_i < full_trip_collection.length; index_i++) {
        let single_trip = full_trip_collection[index_i];
        if (!seen_origins[single_trip.origin]) { seen_origins[single_trip.origin] = true; unique_origins.push(single_trip.origin); }
        if (!seen_dests[single_trip.destination]) { seen_dests[single_trip.destination] = true; unique_dests.push(single_trip.destination); }
    }

    unique_origins.sort(); unique_dests.sort();

    const $origin_filter = $('#origin-select'), $dest_filter = $('#dest-select');
    unique_origins.forEach(function(origin_item) {
        $origin_filter.append(`<option value="${origin_item}">${origin_item}</option>`);
    });
    unique_dests.forEach(function(dest_item) {
        $dest_filter.append(`<option value="${dest_item}">${dest_item}</option>`);
    });

    if (route_from) $origin_filter.val(route_from);
    if (route_to) $dest_filter.val(route_to);
}

function showScheduleTable() {
    if (!$('#schedule-table').length) return;

    const $table_body = $('#schedule-table tbody');
    let selected_origin = $('#origin-select').val() || route_from;
    let selected_dest = $('#dest-select').val() || route_to;

    $table_body.empty();
    let filter_results = [];

    for (let index_j = 0; index_j < full_trip_collection.length; index_j++) {
        let current_item = full_trip_collection[index_j];
        let origin_ok = (selected_origin === 'ALL' || selected_origin === null || current_item.origin === selected_origin);
        let dest_ok = (selected_dest === 'ALL' || selected_dest === null || current_item.destination === selected_dest);
        if (origin_ok && dest_ok) filter_results.push(current_item);
    }

    if (filter_results.length === 0) {
        $table_body.append('<tr><td colspan="5" class="no-records">No trains found for this route.</td></tr>');
        return;
    }

    for (let index_k = 0; index_k < filter_results.length; index_k++) {
        let final_row = filter_results[index_k];
        $table_body.append(`
            <tr>
                <td class="station-badge">${final_row.origin}</td>
                <td class="station-badge">${final_row.destination}</td>
                <td>${final_row.actual_date}</td>
                <td class="time-highlight">${final_row.departure}</td>
                <td>
                    <button class="btn-primary btn-sm book-now-btn"
                            data-origin="${final_row.origin}" data-dest="${final_row.destination}"
                            data-date="${final_row.actual_date}" data-time="${final_row.departure}">
                        Book Now
                    </button>
                </td>
            </tr>
        `);
    }
}

$('#origin-select, #dest-select').on('change', function() {
    route_from = route_to = undefined;
    window.history.replaceState({}, document.title, window.location.pathname);
    showScheduleTable();
});

$('#reset-filters-btn').on('click', function() {
    route_from = route_to = undefined;
    window.history.replaceState({}, document.title, window.location.pathname);
    $('#origin-select').val('ALL');
    $('#dest-select').val('ALL');
    showScheduleTable();
});

$('#schedule-table').on('click', '.book-now-btn', function() {
    window.location.href = `booking.html?from=${$(this).data('origin')}&to=${$(this).data('dest')}&date=${encodeURIComponent($(this).data('date'))}&time=${encodeURIComponent($(this).data('time'))}`;
});

// prefill booking form if arriving from schedule
function fillBookingForm() {
    if (!$('#bookingForm').length) return;

    if (route_from) {
        const mapping_name = code_to_name[route_from.toUpperCase()];
        if (mapping_name) $('#start').val(mapping_name);
    }
    if (route_to) {
        const mapping_name = code_to_name[route_to.toUpperCase()];
        if (mapping_name) $('#end').val(mapping_name);
    }

    updateFormDates();
}

$(document).ready(function() {
    makeTrainSchedule();
    makeFilterOptions();
    showScheduleTable();
    makeStationDrops();
    fillBookingForm();
});