$(document).ready(function() {
	infoCliente();
});

function infoCliente(){
	 $("#listaClientes").change(function(){
		var op = $("#listaClientes option:selected").val();
		window.location.assign("../consult/consulta1r/" + op);
	});
}

