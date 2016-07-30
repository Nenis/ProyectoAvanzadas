$(document).ready(function() {
	infoCliente();
	var valor = $("#pass").html();
	console.log(valor);
	$("#listaPasatiempos").val(valor);
	$("#op").val(valor);
});

function infoCliente(){
	 $("#listaPasatiempos").change(function(){
		var op = $("#listaPasatiempos option:selected").val();
		window.location.assign("../consulta2r/" + op);
	});
}

