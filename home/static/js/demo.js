$(document).ready(function () {
    // $('#SQLSearch').on('click', function () {
    //         console.log($('#SQLSearchTextarea').val())
    //         $('#datatable').DataTable().clear().draw();
    //         $('#datatable').DataTable().columns.adjust().draw();
    //         // $('#datatable').DataTable().draw()
    //     }
    // )
    $('#datatable').DataTable({
        "processing": true,
        "serverSide": true,
        "deferRender": true,
        "iDisplayLength": 25,
        "paging": true,
        ajax: {
            url: '{% url "views_table" %}',
            // url: '../views/table',
            "type": 'GET',
            dataSrc: 'data',
            // "data": function (d) {
            //     d.query = $('#SQLSearchTextarea').val()
            // }
        },
        columns: [
            {"data": "id"},
            {"data": "cid"},
            {"data": "city"},
            {"data": "latitude"},
            {"data": "longitude"},
            {"data": "street_name"},
            {"data": "injured_count"},
            {"data": "crash_time"},
        ]
    })

})
;

