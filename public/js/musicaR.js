$(document).ready(function() {
	infoCliente();
	var valor = $("#pass").html();
	console.log(valor);
	$("#opciones").val(valor);
	$("#op").val(valor);
});

function infoCliente(){
	 $("#opciones").change(function(){
		var op = $("#opciones option:selected").val();
		window.location.assign("../musicaR/" + op);
	});
}
