
// function validarEmail() {
// 	var  email = document.forms["formulario"]["correo"].value;
//     expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//     if ( !expr.test(email) )
//         alert("Error: La dirección de correo " + email + " es incorrecta.");
//     	return false;
// }



function validateForm() {
    var x = document.forms["formulario"]["correo"].value;
    console.log(x);
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    }
}