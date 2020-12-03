
$(document).ready(function () {
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: (target.offset().top - 72)
            }, 1000, "easeInOutExpo");
            return false;
          }
        }
      });
    
      // Closes responsive menu when a scroll trigger link is clicked
      $('.js-scroll-trigger').click(function() {
        $('.navbar-collapse').collapse('hide');
      });
    
      // Activate scrollspy to add active class to navbar items on scroll
      $('body').scrollspy({
        target: '#mainNav',
        offset: 75
      });
    
      // Collapse Navbar
      var navbarCollapse = function() {
        if ($("#mainNav").offset().top > 100) {
          $("#mainNav").addClass("navbar-scrolled");
        } else {
          $("#mainNav").removeClass("navbar-scrolled");
        }
      };
      // Collapse now if page is not at top
      navbarCollapse();
      // Collapse the navbar when page is scrolled
      $(window).scroll(navbarCollapse);
    
      // Magnific popup calls
    //   $('#portfolio').magnificPopup({
    //     delegate: 'a',
    //     type: 'image',
    //     tLoading: 'Loading image #%curr%...',
    //     mainClass: 'mfp-img-mobile',
    //     gallery: {
    //       enabled: true,
    //       navigateByImgClick: true,
    //       preload: [0, 1]
    //     },
    //     image: {
    //       tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    //     }
    //   });

    function alert(e) {
        $("body").append('<div class="zhezhao" id="zhezhao"></div><div id="msg"><div id="msg_top">Warning<span class="msg_close">×</span></div><div id="msg_cont">' + e + '</div><div class="msg_close" id="msg_clear">Close</div></div>');
        document.body.style.overflow = "hidden";
        $(".msg_close").click(function () {
            $("#msg").remove();
            $("#zhezhao").remove();
            document.body.style.overflow = "visible";
        });
    }
    window.alert = alert;
    //$('input').attr('autocomplete', 'address');
    //$('.cscz').css('display', 'none');
    //$('#From_AddressLine').attr('autocomplete', 'nope');

    var table = $('#datatable').DataTable({
        "processing": true,
        "serverSide": false,
        "deferRender": true,
        "iDisplayLength": 25,
        "paging": false,
        "deferLoading": 0, //載入時不執行查詢
        "order": [[3, "asc"]],
        "info": true,
        "drawCallback": function (setting) {
            var result = setting.json;
            var check = [false, false, false, false];

            var height = parseFloat($('#Height').val());
            var length = parseFloat($('#Length').val());
            var width = parseFloat($('#Width').val());
            var s_unit = $('#t1').prop("checked");
            s_unit = s_unit ? 'in' : 'cm';
            var weight = parseFloat($('#Weight').val());
            var w_unit = $('#t3').prop("checked");
            w_unit = w_unit ? 'lb' : 'kg';

            if (result !== undefined) {
                var em = '';
                if (s_unit === 'cm') {
                    height = height * 0.393700787;
                    length = length * 0.393700787;
                    width = width * 0.393700787;
                }
    
                if (w_unit === 'kg') {
                    weight = weight * 2.20462262;
                }
    
                if ((length + (2 * width) + (2 * height)) > 108 || weight > 70) {
                    em = '<b>USPS</b> and <b>Sendle</b> only can deliver the size are smaller than 108 inches and 70 pounds.' + '<br>' + '(hint: length + girth, where girth is 2*width + 2*height)';
                }

                // if (result.data.length === 0) {
                //     alert('Address is wrong, please check');
                //     window.location.hash = "";
                //     $('html,body').animate({scrollTop: $("#Address_line").offset().top - 110 + 'px'}, 'slow');
                // } 
                // else {
                //     //$('html,body').animate({scrollTop: $("#submit").offset().top}, 'slow');
                // }
                $('tbody tr').click(function (element) {
                    var td = $(element.currentTarget.firstChild.lastChild).text();
                    var ul = '';
                    switch (td) {
                    case "UPS":
                        check[0] = true;
                        ul = "https://www.ups.com/us/en/global.page";
                        break;
                    case "Fedex":
                        check[1] = true;
                        ul = "https://www.fedex.com/en-us/home.html";
                        break;
                    case "USPS":
                        check[2] = true;
                        ul = "https://www.usps.com/ship/";
                        break;
                    case "Sendle":
                        check[3] = true;
                        ul = "https://try.sendle.com/en-us/pricing";
                        break;
                    default:
                        break;
                    }
                    window.open(ul);
                });

                for (var i = 0; i < result.data.length; i++) {
                    switch(result.data[i]['Company']) {
                    case "UPS":
                        check[0] = true;
                        break;
                    case "Fedex":
                        check[1] = true;
                        break;
                    case "USPS":
                        check[2] = true;
                        break;
                    case "Sendle":
                        check[3] = true;
                        break;
                    }
                }
                // console.log(result);

                var errormessage = '';
                // console.log(check);
                if (!check[0]) {
                    errormessage += '<b>UPS</b> doesn’t support these addresses.';
                }
                if (!check[1]) {
                    if (errormessage) {
                        errormessage += '<br>';
                    }
                    errormessage += '<b>Fedex</b> doesn’t support these addresses.';
                }
                if (!check[2]) {
                    if (!em) {
                        if (errormessage) {
                            errormessage += '<br>';
                        }
                        errormessage += '<b>USPS</b> doesn’t support these addresses.';
                    }
                }
                if (!check[3]) {
                    if (!em) {
                        if (errormessage) {
                            errormessage += '<br>';
                        }
                        errormessage += '<b>Sendle</b> doesn’t support these addresses.';
                    }
                }
                // console.log(em);
                // console.log(errormessage);
                if (em === '' && errormessage) {
                    $('#servicealret').removeAttr('style');
                    $('#servicealret').css("color", "black");
                    $('#servicealret').css("font-size", "1.5rem");
                    $('#servicealret').html(errormessage);
                } else if (em && errormessage){
                    console.log('em not empty')
                    $('#servicealret').removeAttr('style');
                    $('#servicealret').css("color", "black");
                    $('#servicealret').css("font-size", "1.5rem");
                    $('#servicealret').html(errormessage + '<br>' + em);
                } else if (em) {
                    $('#servicealret').removeAttr('style');
                    $('#servicealret').css("color", "black");
                    $('#servicealret').css("font-size", "1.5rem");
                    $('#servicealret').html(em);
                }
            }

        },
        "columns": [
            {
                "data": "Company",
                "orderable": true,
                "render": function (data) {
                    switch (data) {
                    case "UPS":
                        return '<img src="static/image/ups.png" style="width:105px;"><div style="display:none">UPS</div>';
                    case "Fedex":
                        return '<img src="static/image/fedex.png" style="width:110px;"><div style="display:none">Fedex</div>';
                    case "USPS":
                        return '<img src="static/image/usps_new.png" style="width:110px;"><div style="display:none">USPS</div>';
                    case "Sendle":
                        return '<img src="static/image/sendle.png" style="width:110px;"><div style="display:none">Sendle</div>';
                    default:
                        return data;
                    }
                }
            },
            {"data": "Service", "orderable": true},
            {"data": "Time", "orderable": true},
            {"data": "Money", "orderable": true},
            {
                "data": "Company",
                "orderable": false,
                "render": function () {
                    return '<i class="fas fa-chevron-right fa-2x" style="color: #007bff;"></i>';
                }
            }
        ]
    });


    $('#submit').click(function () {
        //alert('e');
        //$('.cscz').removeAttr('disabled');
        $('#datatable').dataTable().fnClearTable();
        //table.clear();

        checksize1 = true;
        checksize2 = true;
        checksize3 = true;
        TestSize();
        TestWeight();
        TestAddress1();
        TestAddress2();
        
        $('#servicealret').css('display', 'none');

        if (sizePass == false) {
            //alert("The size have problem.");
            $('html,body').animate({scrollTop: $("#itemSize").offset().top - 100 + "px"}, 'slow');
        } else if (weightPass == false) {
            //alert("The weight have problem.");
            $('html,body').animate({scrollTop: $("#itemSize").offset().top - 100 + "px"}, 'slow');
        } else if ( AddressPass1 == false) {
            //alert("The shipping from address have problem.");
            $('html,body').animate({scrollTop: $("#ShippingFrom").offset().top - 110 + "px"}, 'slow');
        } else if( AddressPass2 == false) {
            //alert("The shipping to address have problem.");
            $('html,body').animate({scrollTop: $("#ShippingFrom").offset().top - 110 + "px"}, 'slow');
        } else {
            table.ajax.url('input/?' + $('#search_form').serialize()).load();
            $('html,body').animate({scrollTop: $("#ResultArea").offset().top - 100 + "px"}, 'slow');
        }

        //$('#divtable').css("visibility", "visible");
        //$('.cscz').attr('disabled', 'disabled');

        return false;
        // $('#From_CountryCode').removeAttr('disabled');
        // $.ajax({
        //     url: 'input/?',
        //     type: 'GET',
        //     tradition: true,
        //     async : false,
        //     data: $('#search_form').serialize(),
        //     dataType: "json",
        //     success: function (data) {
        //         var tables = $('#datatable').DataTable({
        //             "processing": true,
        //             "serverSide": true,
        //             "deferRender": true,
        //             "iDisplayLength": 25,
        //             "paging": false,
        //             "deferLoading": 0,
        //             "retrieve":true
        //             }
        //         );
        //         tb = document.getElementById('datatable');
        //         var rowNum=tb.rows.length;
        //         for (i=1;i<rowNum;i++) {
        //             tb.deleteRow(i);
        //             rowNum=rowNum-1;
        //             i=i-1;
        //         }
        //         var tbody = document.createElement("tbody");
        //                 for (var i in data.data){
        //                     var tr = document.createElement("tr");
        //                         for(var j in data.data[i]){
        //                         if(j == 0){
        //                             if(data.data[i][j] == "UPS"){
        //                                 var td = document.createElement("td");
        //                                 td.innerHTML=data.data[i][j];
        //                                tr.appendChild(td);
        //                             }
        //                         }
        //                         else{
        //                             var td = document.createElement("td");
        //                             td.innerHTML=data.data[i][j];
        //                             tr.appendChild(td);
        //                         }
        //                     }
        //                     var td2 = document.createElement("td");
        //                     var butt=document.createElement("a");
        //                     butt.href = 'https://www.ups.com/us/en/global.page';
        //                     butt.type = 'button';
        //                     butt.setAttribute('class', "btn btn-primary btn-sm");
        //                     butt.innerHTML = "go to";
        //                     td2.appendChild(butt);
        //                     tr.appendChild(td2);
        //                     tbody.appendChild(tr);
        //                 }
        //                 tb.appendChild(tbody);
        //         console.log(data.data);
        //         //document.getElementById('table1').style.visibility="hidden";
        //     },
        //     error:function (){
        //         alert('eqeqqq');
        //     }
        // });
        // $('#From_CountryCode').attr('disabled', 'disabled');
        // return false;
    });
});