$(document).ready(function() {
	infoCliente();
});

function infoCliente(){
	 $("#opciones").change(function(){
		var op = $("#opciones option:selected").val();
		window.location.assign("../consult/musicaR/" + op);
	});
}