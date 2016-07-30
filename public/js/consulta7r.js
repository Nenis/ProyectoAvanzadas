$(document).ready(function() {
	infoCliente();
	var valor = $("#musc").html();
	console.log(valor);
	$("#listaComidas").val(valor);
	$("#op").val(valor);
});

function infoCliente(){
	 $("#listaComidas").change(function(){
		var op = $("#listaComidas option:selected").val();
		window.location.assign("../consulta7r/" + op);
	});
}
