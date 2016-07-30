$(document).ready(function() {
	infoCliente();
	var valor = $("#correo").html();
	console.log(valor);
	$("#listaClientes").val(valor);
	// $(IdDelSelect).selectmenu("refresh");

});

function infoCliente(){
	 $("#listaClientes").change(function(){
		var op = $("#listaClientes option:selected").val();
		window.location.assign("../consulta1r/" + op);
	});
}

