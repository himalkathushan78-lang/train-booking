const stationValues = {
            "Colombo": 20,
            "Kandy": 40,
            "Galle": 10,
            "Jaffna": 80,
            "Trincomalee":60,
        };

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