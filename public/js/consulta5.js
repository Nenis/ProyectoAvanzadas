$(document).ready(function() {
	infoCliente();
});


function infoCliente(){
	 $("#listaMusica").change(function(){
		var op = $("#listaMusica option:selected").val();
		window.location.assign("../consult/consulta5r/" + op);
	});
}

