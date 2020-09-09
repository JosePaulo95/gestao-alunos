$(document).ready(function() {
    $('.table').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ]
    } );
    $("#DataTables_Table_0_filter").hide();
    $("#DataTables_Table_0_info").hide();
    $("#DataTables_Table_0_paginate").hide();

    let bt_excel = $(".dt-button.buttons-excel.buttons-html5");

    $(".botoes-data-table").append('<div class="level-item"></div>')
    $(".botoes-data-table .level-item").append(bt_excel)
    bt_excel.append('\
    	<span class="icon">\
    		<i class="fa fa-download"></i>\
  		</span>\
  		')
	bt_excel.removeClass("dt-button buttons-html5");
	bt_excel.addClass("button is-small");
} );

