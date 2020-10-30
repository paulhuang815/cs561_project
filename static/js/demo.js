$(document).ready(function () {

    // var table = $('#datatable').DataTable({
    //     "processing": true,
    //     "serverSide": true,
    //     "deferRender": true,
    //     "iDisplayLength": 25,
    //     "paging": true,
    //     "deferLoading": 0, //載入時不執行查詢
    //     "ajax": {
    //         url: '/input',
    //         // url: '../views/table',
    //         type: 'GET',
    //         dataSrc: 'data',
    //     },
    //     "columns": [
    //         {"data": "Company"},
    //         {"data": "Service"},
    //         {"data": "Money"}
    //     ]
    // });
    

    $('#submit').click(function () {
        // table.ajax.url('input/?' + $('#search_form').serialize()).load();
        // return false;
        $('#From_CountryCode').removeAttr('disabled');
        $.ajax({
            url: 'input/?',
            type: 'GET',
            tradition: true,
            async : false,
            data: $('#search_form').serialize(),
            dataType: "json",
            success: function (data) {
                $('#datatable').DataTable({
                            "processing": true,
                            "serverSide": true,
                            "deferRender": true,
                            "iDisplayLength": 25,
                            "paging": false,
                            "deferLoading": 0,
                            retrieve:true
                            }
                        )
                tb = document.getElementById('datatable');
                var rowNum=tb.rows.length;
                for (i=1;i<rowNum;i++) {
                    tb.deleteRow(i);
                    rowNum=rowNum-1;
                    i=i-1;
                }
                var tbody = document.createElement("tbody");
                        for (var i in data.data){
                            var tr = document.createElement("tr");
                                for(var j in data.data[i]){
                                if(j == 0){
                                    if(data.data[i][j] == "UPS"){
                                        var td = document.createElement("td");
                                        td.innerHTML=data.data[i][j];
                                       tr.appendChild(td);
                                    }
                                }
                                else{
                                    var td = document.createElement("td");
                                    td.innerHTML=data.data[i][j];
                                    tr.appendChild(td);
                                }
                            }
                            var td2 = document.createElement("td");
                            var butt=document.createElement("a");
                            butt.href = 'https://www.ups.com/us/en/global.page';
                            butt.type = 'button';
                            butt.setAttribute('class', "btn btn-primary btn-sm");
                            butt.innerHTML = "skip";
                            td2.appendChild(butt);
                            tr.appendChild(td2);
                            tbody.appendChild(tr);
                        }
                        tb.appendChild(tbody);

                //document.getElementById('table1').style.visibility="hidden";
            },
            error:function (){
                alert('eqeqqq');
            }
        });
        $('#From_CountryCode').attr('disabled', 'disabled');
        return false;
    });
});