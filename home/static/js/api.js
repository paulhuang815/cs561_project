/*jshint esversion: 6 */
let placeSearch;
let autocomplete_from;
let autocomplete_to;
const componentForm = {
    street_number: "short_name",
    route: "long_name",
    locality: "short_name",
    administrative_area_level_1: "short_name",
    country: "short_name",
    postal_code: "short_name"
};

function getKeyByValue(object, value) {
    if (value.length == 2){
        return value;
    }
    return Object.keys(object).find(key => object[key] === value);
};

  // street_number + route = address
  // locality = city
  // administrative_area_level_1 = state
  // country = country
  // postal_code = zipcode
function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete_to = new google.maps.places.Autocomplete(
        document.getElementById("To_AddressLine"),
        { types: ["geocode"] }
    );
    autocomplete_from = new google.maps.places.Autocomplete(
    document.getElementById("From_AddressLine"),
    { types: ["geocode"] }
    );
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete_to.setFields(["address_component"]);
    autocomplete_from.setFields(["address_component"]);
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete_to.addListener("place_changed", fillInAddress_to);
    autocomplete_from.addListener("place_changed", fillInAddress_from);
}

var fromaddress = '';
// [START maps_places_autocomplete_addressform_fillform]
function fillInAddress_from() {
    const place_from = autocomplete_from.getPlace();

    for (const component of place_from.address_components) {
        const addressType = component.types[0];

        if (componentForm[addressType]) {
            const val = component[componentForm[addressType]];
            fromaddress = fromaddress + '"' + addressType + '":"' + val + '",';
            //document.getElementById("From_AddressLine").value = val;
        }
    }

    $('.f_group input').val('');
    $('.f_group').css('display', 'none');

    fromaddress = '{' + fromaddress + '"End":"Endlist"}';

    console.log(fromaddress);

    faj = JSON.parse(fromaddress);

    // from
    $('#From_CountryCode').val(faj.country);

    if (faj.administrative_area_level_1) {
        if (faj.locality) {
            $('#From_StateProvinceCode').val(faj.administrative_area_level_1);
        }
        else {
            faj.locality = faj.administrative_area_level_1;
        }
    }

    if (faj.locality) {
        $('#From_City').val(faj.locality);
        document.getElementById('waring3p').style.display ="none";
        AddressPass2 = true;
    }
    else {
        $('.F_City').css("display", "");
        document.getElementById('waring3p').innerHTML = "Can't find city name. Please input";
        document.getElementById('waring3p').style.display = "block";
        AddressPass2 = false;
    }

    if (faj.postal_code) {
        $('#From_PostalCode').val(faj.postal_code);
        document.getElementById('waring3p2').style.display ="none";
        AddressPass2 = true;
    }
    else {
        $('.F_Zip').css("display", "");
        document.getElementById('waring3p2').innerHTML = "Can't find zipcode. Please input";
        document.getElementById('waring3p2').style.display = "block";
        AddressPass2 = false;
    }

    fromaddress = '';

}

var toaddress = '';

function fillInAddress_to() {
    // Get the place details from the autocomplete object.
    const place_to = autocomplete_to.getPlace();

    // for (const component in componentForm) {
    //   document.getElementById(component).value = "";
    //   document.getElementById(component).disabled = false;
    // }

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (const component of place_to.address_components) {
        const addressType = component.types[0];

        if (componentForm[addressType]) {
            const val = component[componentForm[addressType]];
            toaddress = toaddress + '"' + addressType + '":"' + val + '",';
            //document.getElementById("To_AddressLine").value = val;
        }
    }

    $('.t_group input').val('');
    $('.t_group').css('display', 'none');

    toaddress = '{' + toaddress + '"End":"Endlist"}';

    console.log(toaddress);

    taj = JSON.parse(toaddress);

    //to
    $('#To_CountryCode').val(taj.country);

    if (taj.administrative_area_level_1) {
        if (taj.locality) {
            $('#To_StateProvinceCode').val(taj.administrative_area_level_1);
        }
        else {
            taj.locality = taj.administrative_area_level_1;
        }
    }

    if (taj.locality) {
        $('#To_City').val(taj.locality);
        document.getElementById('waring4p').style.display ="none";
        AddressPass2 = true;
    }
    else {
        $('.T_City').css("display", "");
        document.getElementById('waring4p').innerHTML = "Can't find city name. Please input";
        document.getElementById('waring4p').style.display = "block";
        AddressPass2 = false;
    }

    if (taj.postal_code) {
        $('#To_PostalCode').val(taj.postal_code);
        document.getElementById('waring4p2').style.display ="none";
        AddressPass2 = true;
    }
    else {
        $('.T_Zip').css("display", "");
        document.getElementById('waring4p2').innerHTML = "Can't find zipcode. Please input";
        document.getElementById('waring4p2').style.display = "block";
        AddressPass2 = false;
    }

    toaddress = '';

    // street_number + route = address
    // locality = city
    // administrative_area_level_1 = state
    // country = country
    // postal_code = zipcode
}

// [END maps_places_autocomplete_addressform_fillform]
// [START maps_places_autocomplete_addressform_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

function geolocate_from() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            };
            const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
            });
            autocomplete_from.setBounds(circle.getBounds());
        });
    }
}

function geolocate_to() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            };
            const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
            });
            autocomplete_to.setBounds(circle.getBounds());
        });
    }
}

$("#From_AddressLine").focus(function() {
    $('#From_AddressLine').attr('autocomplete', 'new-password');
    geolocate_from();
});

$("#To_AddressLine").focus(function() {
    $('#To_AddressLine').attr('autocomplete', 'new-password');
    geolocate_to();
});

// var US_State = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID",
// "IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE",
// "NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
// "TX","UT","VT","VA","WA","WV","WI","WY"];

// autocomplete1(document.getElementById("From_StateProvinceCode"), US_State);

// function autocomplete1(inp, arr) {
//     /*the autocomplete function takes two arguments,
//     the text field element and an array of possible autocompleted values:*/
//     var currentFocus;
//     /*execute a function when someone writes in the text field:*/
//     inp.addEventListener("input", function(e) {
//         var a, b, i, val = this.value;
//         /*close any already open lists of autocompleted values*/
//         closeAllLists();
//         if (!val) { return false;}
//         currentFocus = -1;
//         /*create a DIV element that will contain the items (values):*/
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         /*append the DIV element as a child of the autocomplete container:*/
//         this.parentNode.appendChild(a);
//         /*for each item in the array...*/
//         for (i = 0; i < arr.length; i++) {
//         /*check if the item starts with the same letters as the text field value:*/
//         if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//             /*create a DIV element for each matching element:*/
//             b = document.createElement("DIV");
//             /*make the matching letters bold:*/
//             b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
//             b.innerHTML += arr[i].substr(val.length);
//             /*insert a input field that will hold the current array item's value:*/
//             b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//             /*execute a function when someone clicks on the item value (DIV element):*/
//             b.addEventListener("click", function(e) {
//                 /*insert the value for the autocomplete text field:*/
//                 inp.value = this.getElementsByTagName("input")[0].value;
//                 /*close the list of autocompleted values,
//                 (or any other open lists of autocompleted values:*/
//                 closeAllLists();
//             });
//             a.appendChild(b);
//         }
//         }
//     });
//     /*execute a function presses a key on the keyboard:*/
//     inp.addEventListener("keydown", function(e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//         /*If the arrow DOWN key is pressed,
//         increase the currentFocus variable:*/
//         currentFocus++;
//         /*and and make the current item more visible:*/
//         addActive(x);
//         } else if (e.keyCode == 38) { //up
//         /*If the arrow UP key is pressed,
//         decrease the currentFocus variable:*/
//         currentFocus--;
//         /*and and make the current item more visible:*/
//         addActive(x);
//         } else if (e.keyCode == 13) {
//         /*If the ENTER key is pressed, prevent the form from being submitted,*/
//         e.preventDefault();
//         if (currentFocus > -1) {
//             /*and simulate a click on the "active" item:*/
//             if (x) x[currentFocus].click();
//         }
//         }
//     });
//     function addActive(x) {
//     /*a function to classify an item as "active":*/
//     if (!x) return false;
//     /*start by removing the "active" class on all items:*/
//     removeActive(x);
//     if (currentFocus >= x.length) currentFocus = 0;
//     if (currentFocus < 0) currentFocus = (x.length - 1);
//     /*add class "autocomplete-active":*/
//     x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//     /*a function to remove the "active" class from all autocomplete items:*/
//     for (var i = 0; i < x.length; i++) {
//         x[i].classList.remove("autocomplete-active");
//     }
//     }
//     function closeAllLists(elmnt) {
//     /*close all autocomplete lists in the document,
//     except the one passed as an argument:*/
//     var x = document.getElementsByClassName("autocomplete-items");
//     for (var i = 0; i < x.length; i++) {
//         if (elmnt != x[i] && elmnt != inp) {
//         x[i].parentNode.removeChild(x[i]);
//         }
//     }
//     }
//     /*execute a function when someone clicks in the document:*/
//     document.addEventListener("click", function (e) {
//         closeAllLists(e.target);
//     });
// }
function ChangeSizeUnit(){
    var inCheckbox = document.getElementById('t1').checked;
    var unit = inCheckbox ? 'inches' : 'cm';
    var getUnits = document.getElementsByClassName('input-group-text');
    // for(var unit of unit_var) {
    //   unit.innerHTML = "cm"
    // }
    getUnits[0].innerHTML = unit;
    getUnits[1].innerHTML = unit;
    getUnits[2].innerHTML = unit;
}

function ChangeWeightUnit(){
    var inCheckbox = document.getElementById('t3').checked;
    var unit = inCheckbox ? 'pounds' : 'kg';
    var getUnits = document.getElementsByClassName('input-group-text');

    getUnits[3].innerHTML = unit;
}