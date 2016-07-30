$(document).ready(function() {
	infoCliente();
	var valor = $("#musc").html();
	console.log(valor);
	$("#listaMusica").val(valor);
	$("#op").val(valor);
});

function infoCliente(){
	 $("#listaMusica").change(function(){
		var op = $("#listaMusica option:selected").val();
		window.location.assign("../consulta5r/" + op);
	});
}
