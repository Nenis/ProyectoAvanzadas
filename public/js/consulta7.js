$(document).ready(function() {
	infoCliente();
});


function infoCliente(){
	 $("#listaComidas").change(function(){
		var op = $("#listaComidas option:selected").val();
		window.location.assign("../consult/consulta7r/" + op);
	});
}

