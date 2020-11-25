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

  var sizePass = false;
  var weightPass = false;
  var AddressPass1 = false;
  var AddressPass2 = false;

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
        }
        else {
            $('.F_City').css("display", "");
        }

        if (faj.postal_code) {
            $('#From_PostalCode').val(faj.postal_code);
        }
        else {
            $('.F_Zip').css("display", "");
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
        }
        else {
            $('.T_City').css("display", "");
        }

        if (taj.postal_code) {
            $('#To_PostalCode').val(taj.postal_code);
        }
        else {
            $('.T_Zip').css("display", "");
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
        $('#From_AddressLine').attr('autocomplete', 'nope');
        geolocate_from();
    });

    $("#To_AddressLine").focus(function() {
        $('#To_AddressLine').attr('autocomplete', 'nope');
        geolocate_to();
    });

//   var US_State = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID",
//   "IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE",
//   "NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
//   "TX","UT","VT","VA","WA","WV","WI","WY"];

//   autocomplete1(document.getElementById("From_StateProvinceCode"), US_State);

//   function autocomplete1(inp, arr) {
//       /*the autocomplete function takes two arguments,
//       the text field element and an array of possible autocompleted values:*/
//       var currentFocus;
//       /*execute a function when someone writes in the text field:*/
//       inp.addEventListener("input", function(e) {
//           var a, b, i, val = this.value;
//           /*close any already open lists of autocompleted values*/
//           closeAllLists();
//           if (!val) { return false;}
//           currentFocus = -1;
//           /*create a DIV element that will contain the items (values):*/
//           a = document.createElement("DIV");
//           a.setAttribute("id", this.id + "autocomplete-list");
//           a.setAttribute("class", "autocomplete-items");
//           /*append the DIV element as a child of the autocomplete container:*/
//           this.parentNode.appendChild(a);
//           /*for each item in the array...*/
//           for (i = 0; i < arr.length; i++) {
//             /*check if the item starts with the same letters as the text field value:*/
//             if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//               /*create a DIV element for each matching element:*/
//               b = document.createElement("DIV");
//               /*make the matching letters bold:*/
//               b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
//               b.innerHTML += arr[i].substr(val.length);
//               /*insert a input field that will hold the current array item's value:*/
//               b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//               /*execute a function when someone clicks on the item value (DIV element):*/
//               b.addEventListener("click", function(e) {
//                   /*insert the value for the autocomplete text field:*/
//                   inp.value = this.getElementsByTagName("input")[0].value;
//                   /*close the list of autocompleted values,
//                   (or any other open lists of autocompleted values:*/
//                   closeAllLists();
//               });
//               a.appendChild(b);
//             }
//           }
//       });
//       /*execute a function presses a key on the keyboard:*/
//       inp.addEventListener("keydown", function(e) {
//           var x = document.getElementById(this.id + "autocomplete-list");
//           if (x) x = x.getElementsByTagName("div");
//           if (e.keyCode == 40) {
//             /*If the arrow DOWN key is pressed,
//             increase the currentFocus variable:*/
//             currentFocus++;
//             /*and and make the current item more visible:*/
//             addActive(x);
//           } else if (e.keyCode == 38) { //up
//             /*If the arrow UP key is pressed,
//             decrease the currentFocus variable:*/
//             currentFocus--;
//             /*and and make the current item more visible:*/
//             addActive(x);
//           } else if (e.keyCode == 13) {
//             /*If the ENTER key is pressed, prevent the form from being submitted,*/
//             e.preventDefault();
//             if (currentFocus > -1) {
//               /*and simulate a click on the "active" item:*/
//               if (x) x[currentFocus].click();
//             }
//           }
//       });
//       function addActive(x) {
//         /*a function to classify an item as "active":*/
//         if (!x) return false;
//         /*start by removing the "active" class on all items:*/
//         removeActive(x);
//         if (currentFocus >= x.length) currentFocus = 0;
//         if (currentFocus < 0) currentFocus = (x.length - 1);
//         /*add class "autocomplete-active":*/
//         x[currentFocus].classList.add("autocomplete-active");
//       }
//       function removeActive(x) {
//         /*a function to remove the "active" class from all autocomplete items:*/
//         for (var i = 0; i < x.length; i++) {
//           x[i].classList.remove("autocomplete-active");
//         }
//       }
//       function closeAllLists(elmnt) {
//         /*close all autocomplete lists in the document,
//         except the one passed as an argument:*/
//         var x = document.getElementsByClassName("autocomplete-items");
//         for (var i = 0; i < x.length; i++) {
//           if (elmnt != x[i] && elmnt != inp) {
//             x[i].parentNode.removeChild(x[i]);
//           }
//         }
//       }
//       /*execute a function when someone clicks in the document:*/
//       document.addEventListener("click", function (e) {
//           closeAllLists(e.target);
//       });
//   }


  function TestSize(){
      var height = document.getElementById('Height').value;
      var Length = document.getElementById('Length').value;
      var Width = document.getElementById('Width').value;
      var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      var unit1 = document.getElementById('Dimension_units').value;

      if( height == '' || Length == '' || Width == ''){
          document.getElementById('waring1p').innerHTML = 'Package dimensions must be at least 1 in for Length, 1 in for Width, and 1 in for Height. Please enter an amount for each of the dimensions fields.';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring1').style.display ="block";
          return;
      }
      else if( !reg.test(height) || !reg.test(Length) || !reg.test(Width)){
          document.getElementById('waring1p').innerHTML = 'The size should be number';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring1').style.display ="block";
          return;
      }
      height = Number(height);
      Length = Number(Length);
      Width = Number(Width);

      if(unit1 == 'cm') {
          height = height * 0.393700787;
          Length = Length * 0.393700787;
          Width = Width * 0.393700787;
      }

      if(height<=0 || Length<=0 || Width<=0){
          document.getElementById('waring1').style.display ="block";
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring1p').innerHTML= "The height/Weight/Width should be bigger than 0";
      }
      else if (2*height+Length+2*Width > 165){


          document.getElementById('waring1').style.display ="block";
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring1p').innerHTML= "Package exceeds the maximum size total constraints of 165 inches / 419.1 cm <br> hint: (length + girth, where girth is 2 x width plus 2 x height)";
      }
      else {
          document.getElementById('waring1').style.display ="none";
          document.getElementById('submit').disabled = 'none';
          sizePass = true;
          
          alert('124');
          
          FinalTest();
      }

  }

  function TestWeight(){

      var weight = document.getElementById('Weight').value;
      var unit23 = document.getElementById('Weight_unit').value;
      var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      //alert();

      if (unit23 == 'kilograms') {
          weight = weight * 2.20462262;
      }

      if(weight == ''){
           document.getElementById('waring2p').innerHTML = 'Weight is required.';
           document.getElementById('submit').disabled = 'true';
           document.getElementById('waring2').style.display ="block";
      }
      else if( !reg.test(weight) || weight <= 0 ){
          document.getElementById('waring2p').innerHTML = 'Only numeric values are allowed. Weight should be more than 0.';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring2').style.display ="block";
      }
      else if (weight >= 150){
          document.getElementById('waring2p').innerHTML = 'Max. weight 150 pounds / 68 kilograms';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring2').style.display ="block";
      }
      else {

          document.getElementById('waring2').style.display ="none";
          weightPass = true;
          FinalTest();
      }

  }

  function TestAddress1(){

      var space1 = document.getElementById('From_AddressLine').value;
      var space2 = document.getElementById('From_City').value;
      var space3 = document.getElementById('From_CountryCode').value;
      var space4 = document.getElementById('From_PostalCode').value;
      var space5 = document.getElementById('From_StateProvinceCode').value;

      var reg = new RegExp("^[0-9]*$");
      if(space1 == ''){
          document.getElementById('waring3p').innerHTML = "Please enter 'Shipping From' address.";
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring3').style.display = "block";
          AddressPass1 = false;
      }
      else {
          document.getElementById('waring3').style.display = "none";
          AddressPass1 = true;
          FinalTest();
      }

  }

    function TestAddress2(){

      var space5 = document.getElementById('To_CountryCode').value;
      var space6 = document.getElementById('To_AddressLine').value;
      var space7 = document.getElementById('To_City').value;
      var space8 = document.getElementById('To_PostalCode').value;
      var space9 = document.getElementById('To_StateProvinceCode').value;


      var reg = new RegExp("^[0-9]*$");
      if(space6 == ''){
          document.getElementById('waring4p').innerHTML = "Please enter 'Shipping To' address.";
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring4').style.display = "block";
          AddressPass2 = false;
      }
      else {
          document.getElementById('waring4').style.display = "none";
          AddressPass2 = true;
          FinalTest();
      }

  }


  function FinalTest(){

      if( weightPass == true && sizePass == true && AddressPass1 == true && AddressPass2 == true){
          document.getElementById('submit').disabled = false;
      }
      else{
          document.getElementById('submit').disabled = true;
      }

  }

window.alert = alert;
        function alert(data) {
            var a = document.createElement("div"),
                p = document.createElement("p"),
                btn = document.createElement("div"),
                textNode = document.createTextNode(data ? data : ""),
                btnText = document.createTextNode("确定");
            // 控制样式
            css(a, {
                "position" : "fixed",
                "left" : "0",
                "right" : "0",
                "top" : "20%",
                "width" : "100px",
                "margin" : "0 auto",
                "background-color" : "#f00",
                "font-size" : "20px",
                "text-align" : "center"
            });
            css(btn, {
                "background" : "blue",
            })
            // 内部结构套入
            p.appendChild(textNode);
            btn.appendChild(btnText);
            a.appendChild(p);
            a.appendChild(btn);
            // 整体显示到页面内
            document.getElementsByTagName("body")[0].appendChild(a);
 
            // 确定绑定点击事件删除标签
            btn.onclick = function() {
                a.parentNode.removeChild(a);
            }
        }
        function css(targetObj, cssObj) {
            var str = targetObj.getAttribute("style") ? targetObj.getAttribute("style") : "";
            for(var i in cssObj) {
                str += i + ":" + cssObj[i] + ";";
            }
            targetObj.style.cssText = str;
        }

  function skip(){
    $('html,body').animate({
        scrollTop: $("#submit").offset().top},'slow');
  }

