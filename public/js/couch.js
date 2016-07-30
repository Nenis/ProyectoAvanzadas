var user = "admin";
var pass = "12345"


function ingresar(){
	var username = document.getElementsByName("info")[0].value;
	var password = document.getElementsByName("info")[1].value; 

	if(username == user && pass == password){
		window.location.assign("../consult/consulta1");
	}
	else {
		alert("Usuario o contraseña incorrectos, verifique sus datos. Para ingresar al modulo de consultas debe ser administrador de WSM Events");
	}
}


function direct() {
	window.location.assign("../eventos/newEvent");
}





