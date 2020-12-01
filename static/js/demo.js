
$(document).ready(function () {

    function alert(e) {
        $("body").append('<div class="zhezhao" id="zhezhao"></div><div id="msg"><div id="msg_top">warning<span class="msg_close">×</span></div><div id="msg_cont">' + e + '</div><div class="msg_close" id="msg_clear">close</div></div>');
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

            if (result !== undefined) {
                if (result.data.length === 0) {
                    alert('Address is wrong, please check');
                    window.location.hash = "";
                    $('html,body').animate({scrollTop: $("#Address_line").offset().top}, 'slow');
                } else {
                    $('html,body').animate({scrollTop: $("#submit").offset().top}, 'slow');
                }
                $('tbody tr').click(function (element) {
                    var td = $(element.currentTarget.firstChild.lastChild).text();
                    var ul = '';
                    switch (td) {
                    case "UPS":
                        ul = "https://www.ups.com/us/en/global.page";
                        break;
                    case "Fedex":
                        ul = "https://www.fedex.com/en-us/home.html";
                        break;
                    case "USPS":
                        ul = "https://www.usps.com/ship/";
                        break;
                    case "Sendle":
                        ul = "https://try.sendle.com/en-us/pricing";
                        break;
                    default:
                        break;
                    }
                    window.open(ul);
                });
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
        //$('#datatable').dataTable().fnClearTable();
        table.clear();

        TestSize();
        TestWeight();
        TestAddress1();
        TestAddress2();
        checksize1 = true;
        checksize2 = true;
        checksize3 = true;


        if (sizePass == false) {
            alert("The size have problem");
            $('html,body').animate({scrollTop: $("#itemSize").offset().top}, 'slow');
        } else if (weightPass == false) {
            alert("The weight have problem");
            $('html,body').animate({scrollTop: $("#itemWeight").offset().top}, 'slow');
        } else if ( AddressPass1 == false) {
            alert("The shipping from address have problem");
            $('html,body').animate({scrollTop: $("#ShippingFrom").offset().top}, 'slow');
        } else if( AddressPass2 == false) {
            alert("The shipping to address have problem");
            $('html,body').animate({scrollTop: $("#ShippingTo").offset().top}, 'slow');
        } else {
            table.ajax.url('input/?' + $('#search_form').serialize()).load();
            $('html,body').animate({scrollTop: $("#ResultArea").offset().top}, 'slow');
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