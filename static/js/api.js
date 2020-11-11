
  let placeSearch;
  let autocomplete;
  const componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      country: "long_name",
      postal_code: "short_name"
  };
<<<<<<< HEAD

   var sizePass = false;
  var weightPass = false;
  var AddressPass1 = false;
  var AddressPass2 = false;
=======
>>>>>>> ccc66cb351c458f49758792be44f5f169a774b2a
  // street_number + route = address
  // locality = city
  // administrative_area_level_1 = state
  // country = country
  // postal_code = zipcode
  function initAutocomplete() {
      // Create the autocomplete object, restricting the search predictions to
      // geographical location types.
      autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("To_AddressLine"),
          { types: ["geocode"] }
      );
      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      autocomplete.setFields(["address_component"]);
      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autocomplete.addListener("place_changed", fillInAddress);
  }
  var toaddress = '';
    // [START maps_places_autocomplete_addressform_fillform]
  function fillInAddress() {
      // Get the place details from the autocomplete object.
      const place = autocomplete.getPlace();

      // for (const component in componentForm) {
      //   document.getElementById(component).value = "";
      //   document.getElementById(component).disabled = false;
      // }

      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.
      for (const component of place.address_components) {
          const addressType = component.types[0];

          if (componentForm[addressType]) {
              const val = component[componentForm[addressType]];
              toaddress = toaddress + '"' + addressType + '":"' + val + '",';
              // document.getElementById(addressType).value = val;
          }
      }
      toaddress = '{' + toaddress + '"hello":"hello"}';
      console.log(toaddress);
      taj = JSON.parse(toaddress);
      $('#To_AddressLine').val(taj.street_number + ' ' + taj.route);
      $('#To_CountryCode').val(taj.country);
      $('#To_StateProvinceCode').val(taj.administrative_area_level_1);
      $('#To_City').val(taj.locality);
      $('#To_PostalCode').val(taj.postal_code);
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
  function geolocate() {
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
              autocomplete.setBounds(circle.getBounds());
          });
      }
  }

  $("#To_AddressLine").focus(function() {
    geolocate();
  });

  var US_State = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID",
  "IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE",
  "NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY"];

  autocomplete1(document.getElementById("From_StateProvinceCode"), US_State);

  function autocomplete1(inp, arr) {
      /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
          var a, b, i, val = this.value;
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false;}
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/
          for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              a.appendChild(b);
            }
          }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
  }
<<<<<<< HEAD

  function TestSize(){
      var height = document.getElementById('Height').value;
      var Length = document.getElementById('Length').value;
      var Width = document.getElementById('Width').value;
      var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      var unit1 = document.getElementById('Dimension_units').value;





      if( height == '' || Length == '' || Width == ''){
          document.getElementById('waring1p').innerHTML = 'please input all number';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring1').style.display ="block";
          return;
      }
      else if( !reg.test(height) || !reg.test(Length) || !reg.test(Width)){
          document.getElementById('waring1p').innerHTML = 'the size should be number';
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
          document.getElementById('waring1p').innerHTML= "Package exceeds the maximum size total constraints of 165 inches <br> hint: (length + girth, where girth is 2 x width plus 2 x height)";
      }
      else {
          document.getElementById('waring1').style.display ="none";
          document.getElementById('submit').disabled = 'none';
          sizePass = true;
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
           document.getElementById('waring2p').innerHTML = 'the weight cannot be empty';
           document.getElementById('submit').disabled = 'true';
           document.getElementById('waring2').style.display ="block";
      }
      else if( !reg.test(weight) ){
          document.getElementById('waring2p').innerHTML = 'the weight should be number';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring2').style.display ="block";
      }
      else if (weight >= 150){
          document.getElementById('waring2p').innerHTML = 'the weight cannot be higher than 150 pounds';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring2').style.display ="block";
      }
      else if (weight <= 0 ){
          document.getElementById('waring2p').innerHTML = 'the weight cannot be lighter than 0 pounds';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring2').style.display = "block";
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
      if(space1 == '' ||space2 == '' ||space3 == '' ||space4 == '' || space5 == ''){
          document.getElementById('waring3p').innerHTML = 'the address cannot be empty';
          document.getElementById('waring3').style.display = "block";
          AddressPass1 = false;
      }
      else if ( !reg.test(space4) ){
          document.getElementById('waring3p').innerHTML = 'the zipcode should be number';
          document.getElementById('waring3').style.display = "block";
          document.getElementById('submit').disabled = 'true';
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
      if(space5 == '' ||space6 == '' ||space7 == '' ||space8 == '' || space9 == ''){
          document.getElementById('waring4p').innerHTML = 'the address cannot be empty';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring4').style.display = "block";
          AddressPass2 = false;
      }
      else if (!reg.test(space8) ){
          document.getElementById('waring4p').innerHTML = 'the zipcode should be number';
          document.getElementById('submit').disabled = 'true';
          document.getElementById('waring4').style.display = "block";
          AddressPass2 = false;
      }


      else {
          document.getElementById('waring4').style.display = "none";
          AddressPass2 = true;
          FinalTest()
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
=======
>>>>>>> ccc66cb351c458f49758792be44f5f169a774b2a
