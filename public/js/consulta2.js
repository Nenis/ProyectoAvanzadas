$(document).ready(function() {
	infoCliente();
});


function infoCliente(){
	 $("#listaPasatiempos").change(function(){
		var op = $("#listaPasatiempos option:selected").val();
		window.location.assign("../consult/consulta2r/" + op);
	});
}

