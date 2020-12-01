var sizePass = false;
var weightPass = false;
var AddressPass1 = false;
var AddressPass2 = false;
var checksize1 = false;
var checksize2 = false;
var checksize3 = false;

$('.TypeNumber').keypress(function (evt) {
    if (evt.which != 8 && evt.which != 0 && evt.which != 46 && evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
    console.log(evt);
});

function TestSize(){
    
    var height = document.getElementById('Height').value;
    var Length = document.getElementById('Length').value;
    var Width = document.getElementById('Width').value;
    var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    // var unit1 = document.getElementById('Dimension_units').value;
    var unit = document.getElementById('t1').checked;
    var unit1 = unit ? 'in' : 'cm';

    if(checksize1 && Length == ''){
        document.getElementById('waring1p').innerHTML = 'Please enter length.';
        //document.getElementById('submit').disabled = 'true';
        document.getElementById('waring1').style.display ="block";
        //document.getElementById('Length').style.border.fontcolor = "red";
        sizePass = false;
        return;
    }
    else{
        document.getElementById('waring1').style.display ="none";
    }
    

    if(checksize2 && Width == ''){
        document.getElementById('waring1p').innerHTML = 'Please enter width.';
        //document.getElementById('submit').disabled = 'true';
        document.getElementById('waring1').style.display ="block";
        //document.getElementById('Length').style.border.fontcolor = "red";
        sizePass = false;
        return;
    }
    else{
        document.getElementById('waring1').style.display ="none";
    }

    if(checksize3 && height == ''){
        document.getElementById('waring1p').innerHTML = 'Please enter heigth.';
        //document.getElementById('submit').disabled = 'true';
        document.getElementById('waring1').style.display ="block";
        //document.getElementById('Length').style.border.fontcolor = "red";
        sizePass = false;
        return;
    }
    else{
        document.getElementById('waring1').style.display ="none";
    }
    
    
    if(checksize1 && checksize2 && checksize3){
        // if( height == '' || Length == '' || Width == ''){
        //     document.getElementById('waring1p').innerHTML = 'Package dimensions must be at least 1. Please enter an amount for each of the dimensions fields.';
        //     //document.getElementById('submit').disabled = 'true';
        //     document.getElementById('waring1').style.display ="block";
        //     //document.getElementById('Length').style.border.fontcolor = "red";
        //     sizePass = false;
        //     return;
        // }
        
        if( !reg.test(height) || !reg.test(Length) || !reg.test(Width)){
            document.getElementById('waring1p').innerHTML = 'The size should be number.';
           // document.getElementById('submit').disabled = 'true';
            document.getElementById('waring1').style.display ="block";
            sizePass = false;
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
            //document.getElementById('submit').disabled = 'true';
            document.getElementById('waring1p').innerHTML= "The height/Weight/Width should be bigger than 0.";
            sizePass = false;
        }
        else if (2*height+Length+2*Width > 165){
  
  
            document.getElementById('waring1').style.display ="block";
            //document.getElementById('submit').disabled = 'true';
            document.getElementById('waring1p').innerHTML= "Package exceeds the maximum size total constraints of 165 inches / 419.1 cm. <br> hint: (length + girth, where girth is 2 x width plus 2 x height)";
            sizePass = false;
        }
        else {
            document.getElementById('waring1').style.display ="none";
            //document.getElementById('submit').disabled = 'none';
            sizePass = true;
        }
    }
      

  }

  function TestWeight(){

    var weight = document.getElementById('Weight').value;
    // var unit23 = document.getElementById('Weight_unit').value;
    var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    var unit = document.getElementById('t3').checked;
    var unit1 = unit ? 'lb' : 'kg';
    //alert();

    if (unit1 == 'kg') {
        weight = weight * 2.20462262;
    }

    if(weight == ''){
        document.getElementById('waring2p').innerHTML = 'Weight is required.';
        //document.getElementById('submit').disabled = 'true';
        document.getElementById('waring2').style.display ="block";
        weightPass = false;
    }
    else if( !reg.test(weight) || weight <= 0 ){
        document.getElementById('waring2p').innerHTML = 'Only numeric values are allowed. Weight should be more than 0.';
        //document.getElementById('submit').disabled = 'true';
        document.getElementById('waring2').style.display ="block";
        weightPass = false;
    }
    else if (weight >= 150){
        document.getElementById('waring2p').innerHTML = 'Max. weight 150 pounds / 68 kilograms.';
        // document.getElementById('submit').disabled = 'true';
        document.getElementById('waring2').style.display ="block";
        weightPass = false;
    }
    else {

        document.getElementById('waring2').style.display ="none";
        weightPass = true;
    }

  }

  function TestAddress1(){
    
    var space1 = document.getElementById('From_AddressLine').value;
    var space2 = document.getElementById('From_City').value;
    var space3 = document.getElementById('From_CountryCode').value;
    var space4 = document.getElementById('From_PostalCode').value;
    var space5 = document.getElementById('From_StateProvinceCode').value;

    if(space1 == ''){
        document.getElementById('waring3p').innerHTML = "Please enter 'Shipping From' address.";
        document.getElementById('waring3p').style.display = "block";
        AddressPass1 = false;
    } else if (space3 === "") {
        document.getElementById('waring3p').innerHTML = "Please choose vaild address from list.";
        document.getElementById('waring3p').style.display = "block";
        // AddressPass1 = false;
        // $('html,body').animate({scrollTop: $("#ShippingFrom").offset().top}, 'slow');
    } else if (space2 === "") {
        document.getElementById('waring3p').innerHTML = "Can't find city name. Please input.";
        document.getElementById('waring3p').style.display = "block";
        AddressPass2 = false;
    } else if (space4 === "" ) {
        document.getElementById('waring3p2').innerHTML = "Can't find zipcode. Please input.";
        document.getElementById('waring3p2').style.display = "block";
        AddressPass2 = false;
    } else {
        document.getElementById('waring3p').style.display = "none";
        document.getElementById('waring3p2').style.display = "none";
        AddressPass1 = true;
    }

    // var reg = new RegExp("^[0-9]*$");
    // if(space1 == ''){
    //     document.getElementById('waring3p').innerHTML = "Please enter 'Shipping From' address.";
    //     //document.getElementById('submit').disabled = 'true';
    //     document.getElementById('waring3').style.display = "block";
    //     AddressPass1 = false;
    // }
    // else {
    //     document.getElementById('waring3').style.display = "none";
    //     AddressPass1 = true;
    //     FinalTest();
    // }
}

function TestAddress2() {
    
    var space5 = document.getElementById('To_CountryCode').value;
    var space6 = document.getElementById('To_AddressLine').value;
    var space7 = document.getElementById('To_City').value;
    var space8 = document.getElementById('To_PostalCode').value;
    var space9 = document.getElementById('To_StateProvinceCode').value;
    //pauseTime(500);
    if (space6 === '') {
        document.getElementById('waring4p').innerHTML = "Please enter 'Shipping To' address.";
        document.getElementById('waring4p').style.display = "block";
        AddressPass2 = false;
    } else if (space5 === "") {
        document.getElementById('waring4p').innerHTML = "Please choose vaild address from list.";
        document.getElementById('waring4p').style.display = "block";
        AddressPass2 = false;
        // $('html,body').animate({
        //     scrollTop: $("#ShippingTo").offset().top},'slow');
    } else if (space7 === "") {
        document.getElementById('waring4p').innerHTML = "Can't find city name. Please input.";
        document.getElementById('waring4p').style.display = "block";
        AddressPass2 = false;
    } else if (space8 === "") {
        document.getElementById('waring4p2').innerHTML = "Can't find zipcode. Please input.";
        document.getElementById('waring4p2').style.display = "block";
        AddressPass2 = false;
    } else {
        document.getElementById('waring4p').style.display = "none";
        document.getElementById('waring4p2').style.display = "none";
        AddressPass2 = true;
    }

    // if(space6 == ''){
    //     document.getElementById('waring4p').innerHTML = "Please enter 'Shipping To' address.";
    //     //document.getElementById('submit').disabled = 'true';
    //     document.getElementById('waring4').style.display = "block";
    //     AddressPass2 = false;
    // }
    // else {
    //     document.getElementById('waring4').style.display = "none";
    //     AddressPass2 = true;
    //     FinalTest();
    // }
}

function ClearFromZipcode(){
    document.getElementById('From_City').value = "";
    document.getElementById("From_PostalCode").value = "";
    document.getElementById('From_StateProvinceCode').value = "";
    document.getElementById('From_CountryCode').value = "";
}

function ClearToZipcode(){
    document.getElementById('To_City').value = "";
    document.getElementById("To_PostalCode").value = "";
    document.getElementById('To_StateProvinceCode').value = "";
    document.getElementById('To_CountryCode').value = "";
}

// function skipAddress(){
// var space4 = document.getElementById('From_PostalCode').value;
// var space8 = document.getElementById('To_PostalCode').value;

// if(space4 == ""){
//     //document.getElementById('submit').disabled = true;
//     document.getElementById('waring3p').innerHTML = "Please use auto complete";
//     document.getElementById('waring3').style.display = "block";
//     $('html,body').animate({
//         scrollTop: $("#ShippingFrom").offset().top},'slow');
// }
// else if(space8 == ""){
//     //document.getElementById('submit').disabled = true;
//     document.getElementById('waring4p').innerHTML = "Please use auto complete";
//     document.getElementById('waring4').style.display = "block";
//     $('html,body').animate({
//         scrollTop: $("#ShippingTo").offset().top},'slow');
// }
// else{
//     $('html,body').animate({
//         scrollTop: $("#ResultArea").offset().top},'slow');
// }
// }

function skipAboutUs() {
    $('html,body').animate({scrollTop: $("#AboutUs").offset().top}, 'slow');
}
