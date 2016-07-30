// import framwork express 
var express = require('express');

//import body-parser para parsear la solicitud del post
var bodyParser = require('body-parser')

//importar nano 
var nano = require('nano')('http://localhost:5984');
var nano_rep = require('nano')('http://25.62.55.152:5984')


// obtener la base de datos couchdb 
var db_name = "eventos";
var db_rep_name = "eventos_replica";


// usar la base de datos
var db = nano.use(db_name);
var db_rep = nano_rep.use(db_rep_name);

// Importar metodos de express
var app = express();


// Uso de body-parser con json y codificadion de la url 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));


// vistas generadas con jade
app.set("view engine", "jade");

//Uso de carpeta public para utilizar js-img-css
app.use(express.static("public"));


// ------------------ FUNCIONES DE INSERCIÓN -----------------------//

// funcion para agregar un documento
function insert_doc_local(doc, tried) {
   // insertar documento
   db.insert(doc,

      //funcion de error en caso de que no exita o que haya algun otro fallo
      function(error, http_body, http_headers) {
         if (error) {
            if (error.message === 'not_found' && tried < 1) {
               // crea la base de datos en caso de que no exita e inserta el documento
               return nano.db.create(db_name, function() {
                  insert_doc_local(doc, tried + 1);
                  console.log(doc);
               });
            } else {
               return console.log(error);
            }
         }
         console.log(http_body);
         //console.log(doc);
         //console.log('inserte en la local');
      });
}


// funcion para agregar un documento
function insert_doc_replica(doc, tried) {
   // insertar documento
   db_rep.insert(doc,

      //funcion de error en caso de que no exita o que haya algun otro fallo
      function(error, http_body, http_headers) {
         if (error) {
            if (error.message === 'no_db_file' && tried < 1) {
               // crea la base de datos en caso de que no exita e inserta el documento
               return nano_rep.db.create(db_rep_name, function() {
                  insert_doc_replica(doc, tried + 1);
                  console.log(doc);
               });
            } else {
               return console.log(error);
            }
         }
         console.log(http_body);
         //console.log(doc);
         //console.log('inserte en la replica');
      });
}


// Llamada a las funciones 
function insert_doc(doc) {
   try {
      insert_doc_local(doc);
   } catch (err) {
      insert_doc_replica(doc);

   }
}


//------------------- CONSULTAS --------------------------- //

app.get("/consult/consulta1r",function(solicitud,respuesta){
   respuesta.render("./consult/consulta1r");
});

//------------------- CONSULTA 1 --------------------------- //

var all = [
   ["Cargando.."]
];
//consulta 1---retorna con la forma: nombre,pasatiempo,comida,musica
function busqueda_cliente(type, respuesta, consulta) {
   //var type = 'Bailarsh'

      db.view('consultas', 'get_correo', function(err, documento) {
         if (!err) {
            var rows = documento.rows; //the rows returned
         }
            var resultado = [];
            var nom;
            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  nom = [rows[i]['value'] , rows[i]['key']];
                  resultado.push(nom);

               }
            } //cierre if
            all[0] = resultado;
         
      }); //cierre res




   db.view('consultas', 'busqueda_cliente', {
         'key': type
      }, function(err, documento) {
         var resultado = new Array();
         var cliente = new Array();

         if (!err) {
            var rows = documento.rows; //the rows returned
            for (i = 0; i < rows.length; i++) {
               resultado = rows[i]['value'];
            } //cierre for

            cliente[0] = resultado[0];
            //console.log(resultado[1].length);
            if (resultado[1] == "") {
               cliente[1] = "Sin Asignar";
            } else {
               var pasa = "pasatiempo";
               var agregar = "";
               for (x = 0; x < resultado[1].length; x++) {
                  if (x == 0) {
                     pasa = resultado[1][x];

                  } else {
                     agregar = "," + resultado[1][x];
                     pasa = pasa + agregar;

                  }

               } //cierre for
               cliente[1] = pasa;
            } //1
            if (resultado[2] == "") {
               cliente[2] = "Sin Asignar";
            } else {
               var comi = "comida1";
               var agregar = "";
               for (x = 0; x < resultado[2].length; x++) {
                  if (x == 0) {
                     comi = resultado[2][x];

                  } else {
                     agregar = "," + resultado[2][x];
                     comi = comi + agregar;
                     //console.log(agregar);
                     //console.log(pasa);

                  }

               } //cierre for
               cliente[2] = comi;
            } //2
            if (resultado[3] == "") {
               cliente[3] = "Sin Asignar";
            } else {
               var musi = "musica";
               var agregar = "";
               for (x = 0; x < resultado[3].length; x++) {
                  if (x == 0) {
                     musi = resultado[3][x];

                  } else {
                     agregar = "," + resultado[3][x];
                     musi = musi + agregar;

                  }

               } //cierre for
               cliente[3] = musi;
            }

            cliente.splice(1, 0, type);

            all[1]= cliente;
            respuesta.render("consult/" + consulta, {
               clientes: cliente,
               todo: all
            });

         } //cierre if

      } //cierre res

   );

} //cierre 


//------------------- CONSULTA 2 --------------------------- //

var pass = [
   ["Cargando..."],
   ["Cargando..."]
];
//consulta 2
function clientes_pasatiempo(type,respuesta,consulta) {
   //var type = 'Bailarsh';
   
   db.view('consultas', 'get_pasa', {
         'group': true
      }, function(err, documento) {

         if (!err) {
            var rows = documento.rows; //the rows returned
            //console.log(rows);

            var resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }
            } //cierre for
            //console.log(resultado);
            pass[0]=resultado;
         } //cierre if


      } //cierre res
   );

   db.view('consultas', 'cliente_por_pasatiempos', {
         'key': type
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
         } //cierre if

         var resultado = [];

         for (i = 0; i < rows.length; i++) {

            resultado[i] = rows[i]['value'];
         } //cierre for
         
         respuesta.render("consult/" + consulta, {
               cxp: resultado,
               pasat: pass,
               escogido: type
         });
      } //cierre res
   );
} //cierre 

//------------------- CONSULTA 3 --------------------------- //
//consulta 3
function get_pasa(respuesta, consulta) {
   //var type = 'Bailarsh';
   db.view('consultas', 'get_pasa', {
         'group': true
      }, function(err, documento) {

         if (!err) {
            var rows = documento.rows; //the rows returned
            //console.log(rows);

            var resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }
            } //cierre for
            //console.log(resultado);
            respuesta.render("consult/" + consulta, {
               pasatiempos: resultado
            });
         } //cierre if


      } //cierre res
   );
} //cierre 


//------------------- CONSULTA 4 --------------------------- //
//consulta 4
function get_musica(respuesta, consulta) {
   db.view('consultas', 'get_musica', {
         'group': true
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);
            var resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }

            } //cierre for
            respuesta.render("consult/" + consulta, {
               musica: resultado
            });

         } //cierre if



      } //cierre res
   );
} //cierre 


//------------------- CONSULTA 5 --------------------------- //

var m = [["Cargando.."]];
//consulta 5
function clientes_musica(type,respuesta,consulta) {
   //var type  =  'Bailarsh';

   db.view('consultas', 'get_musica', {
         'group': true
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);
            var resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }

            } //cierre for

            m[0] = resultado;

         } //cierre if



      } //cierre res
   );




   db.view('consultas', 'cliente_por_musica', {
         'key': type
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if

         var resultado = [];

         for (i = 0; i < rows.length; i++) {

            resultado[i] = rows[i]['value'];
         } //cierre for
         //console.log(resultado);
         respuesta.render("consult/" + consulta, {
            cxm: resultado,
            escogido: type,
            musica: m
         });
      } //cierre res
   );
} //cierre 

//------------------- CONSULTA 6 --------------------------- //

//consulta 6
function get_comida(respuesta, consulta) {
   //var type = 'Bailarsh';
   db.view('consultas', 'get_comida', {
         'group': true
      }, function(err, documento) {
         if (!err) {
            var rows = documento.rows;
            var resultado = [];
            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }
            } //cierre for
            // console.log(resultado);
            respuesta.render("consult/" + consulta, {
               comida: resultado
            });
         } //cierre if
         else {
            console.log(err.message);
         }
      } // cierre res
   );

} //cierre 

//------------------- CONSULTA 7 --------------------------- //
//consulta 7

var comi= [["Cargando.."]];
function clientes_comida(type,respuesta,consulta) {
   //var type = 'Bailarsh';

   db.view('consultas', 'get_comida', {
         'group': true
      }, function(err, documento) {
         if (!err) {
            var rows = documento.rows;
            var resultado = [];
            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }
            } //cierre for
            // console.log(resultado);

            comi[0] = resultado;
         } //cierre if
         else {
            console.log(err.message);
         }
      } // cierre res
   );




   db.view('consultas', 'cliente_por_comida', {
         'key': type
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if

         var resultado = [];

         for (i = 0; i < rows.length; i++) {

            resultado[i] = rows[i]['value'];
         } //cierre for

         respuesta.render("consult/" + consulta, {
            cxp: resultado,
            comida: comi,
            escogido: type

         });
      } //cierre res
   );

} //cierre 

//------------------- CONSULTA 8 --------------------------- //

//--------------------------8A ----------------------------- //

var comcom= [["Cargando.."]];

function count_comida(type,respuesta,consulta) {
   //var type = 'Bailarsh';


   db.view('consultas', 'get_comida', {
         'group': true
      }, function(err, documento) {
         if (!err) {
            var rows = documento.rows;
            var resultado = [];
            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }
            } //cierre for
            // console.log(resultado);

            comcom[0] = resultado;
         } //cierre if
         else {
            console.log(err.message);
         }
      } // cierre res
   );



   db.view('consultas', 'count_comida', {
         'key': type
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if

         var resultado;

         for (i = 0; i < rows.length; i++) {

            resultado = rows[i]['value'];
         } //cierre for
         //console.log(resultado);
         respuesta.render("consult/" + consulta, {
            cantidad: resultado,
            comida: comcom,
            escogido: type

         });
      } //cierre res
   );
} //cierre 

//--------------------------8B ----------------------------- //

var patpat = [["Cargando.."]]; 


function count_pasatiempos(type,respuesta,consulta) {
   //var type = 'Bailarsh';

   db.view('consultas', 'get_pasa', {
         'group': true
      }, function(err, documento) {

         if (!err) {
            var rows = documento.rows; //the rows returned
            //console.log(rows);

            var resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  resultado.push(rows[i]['key']);
               }
            } //cierre for
            //console.log(resultado);
            patpat[0]=resultado;
         } //cierre if


      } //cierre res
   );


   db.view('consultas', 'count_pasatiempos', {
         'key': type
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if

         var resultado;

         for (i = 0; i < rows.length; i++) {

            resultado = rows[i]['value'];
         } //cierre for
         //console.log(resultado);
         respuesta.render("consult/" + consulta, {
            cantidad: resultado,
            pasatiempos: patpat,
            escogido: type

         });
      } //cierre res
   );
} //cierre 

//--------------------------8C ----------------------------- //

var mumumu = [["Cargando.."]];

function count_musica(type,respuesta,consulta) {
   db.view('consultas', 'get_musica', {
               'group': true
            }, function(err, doc) {

               if (!err) {
                  var rows = doc.rows; //the rows returned
                  //console.log(rows);


               } //cierre if

               var resultado = [];

               for (i = 0; i < rows.length; i++) {
                  if (rows[i]['key'] != "") {
                     resultado.push(rows[i]['key']);
                  }

               } //cierre for
               mumumu[0] = resultado;
               
               //return resultado
            } //cierre res
         );

   
   db.view('consultas', 'count_musica', {
         'key': type
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if

         var resultado;

         for (i = 0; i < rows.length; i++) {

            resultado = rows[i]['value'];
         } //cierre for
         //console.log(resultado);
         respuesta.render("consult/" + consulta, {
            cantidad: resultado,
            musica: mumumu,
            escogido: type

         });
      } //cierre res
   );
} //cierre

//--------------------------CIERRE CONSULTAS-------------------------------- //


//--------------------------LLENAR COMBOBOX----------------------------- //

//carga combo de eleccion de cliente-->retorna nombre-correo
function get_clientes(respuesta, consulta) {
   //var type = 'Bailarsh';
   db.view('consultas', 'get_correo', function(err, documento) {
         if (!err) {
            var rows = documento.rows; //the rows returned
            var resultado = [];
            var nom;
            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  nom = [rows[i]['value'] , rows[i]['key']];
                  resultado.push(nom);

               }
            } //cierre if
            // console.log(resultado);
            respuesta.render("consult/" + consulta, {
               clienteCorreo: resultado
            });
         } //cierre for
         //console.log(resultado);
         else {
            console.log(err);
         }

      } //cierre res
   );
} //cierre 

//----------------------------------------------------------

//valida q el correo sea unico-->retorna 0 si el correo ya esta y 1 si no esta y la insercion puede proseguir
function validar_correo(correo) {
   //var type = 'Bailarsh';
   db.view('consultas', 'get_correo', {
         'key': correo
      }, function(err, doc) {
         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);
            //console.log(rows[0]);
         } //cierre if
         if (rows[0] != undefined) {
            return 0;
         } else {
            return 1
         }


         //console.log(res);
         //return resultado
      } //cierre res
   );
} //cierre 

//----------------------------------------------------------

//consulta 6 version 2---> retorna un arreglo de arreglos de 2 posicones 0=nombre,1=comidas
function prefe_comida(respuesta, consulta) {
   //var type = 'Bailarsh';
   db.view('consultas', 'prefe_comida', function(err, doc) {
         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if 

         var nombres = [];
         valores = [];
         listo = [];
         resultado = [];

         for (i = 0; i < rows.length; i++) {
            if (rows[i]['key'] != "") {
               nombres.push(rows[i]['key']);
            }

         } //cierre for
         //console.log(nombres);
         for (i = 0; i < rows.length; i++) {

            valores.push(rows[i]['value']);
         }

         //return resultado
         for (x = 0; x < valores.length; x++) {
            if (valores[x] == "") {
               listo[x] = "Sin Asignar";
            } else {
               var pasa = "pasatiempo";
               var agregar = "";
               for (m = 0; m < valores[x].length; m++) {
                  if (m == 0) {
                     pasa = valores[x][m];

                  } else {
                     agregar = "," + valores[x][m];
                     pasa = pasa + agregar;
                     //console.log(agregar);
                     //console.log(pasa);

                  }

               } //cierre for
               listo[x] = pasa;
            }
         } //cierre for x
         //console.log(listo);
         for (z = 0; z < listo.length; z++) {
            resultado[z] = [nombres[z], listo[z]];
            //resultado[z][1]=listo[z];

         } //for z
         console.log(resultado);
         respuesta.render("consult/" + consulta, {
            comidas: resultado
         });
      } //cierre res
   );
}

//----------------------------------------------------------
//consulta 4 version 2---> retorna un arreglo de arreglos de 2 posicones 0=nombre,1=musica
function prefe_musica(respuesta, consulta) {
   //var type = 'Bailarsh';
   db.view('consultas', 'prefe_musica', function(err, documento) {
         if (!err) {
            var rows = documento.rows; //the rows returned
            //console.log(rows);
            var nombres = [];
            valores = [];
            listo = [];
            resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  nombres.push(rows[i]['key']);
               }

            } //cierre for
            //console.log(nombres);
            for (i = 0; i < rows.length; i++) {

               valores.push(rows[i]['value']);
            }

            //return resultado
            for (x = 0; x < valores.length; x++) {
               if (valores[x] == "") {
                  listo[x] = "Sin Asignar";
               } else {
                  var pasa = "pasatiempo";
                  var agregar = "";
                  for (m = 0; m < valores[x].length; m++) {
                     if (m == 0) {
                        pasa = valores[x][m];

                     } else {
                        agregar = "," + valores[x][m];
                        pasa = pasa + agregar;
                        //console.log(agregar);
                        //console.log(pasa);

                     }

                  } //cierre for
                  listo[x] = pasa;
               }
            } //cierre for x
            //console.log(listo);
            for (z = 0; z < listo.length; z++) {
               resultado[z] = [nombres[z], listo[z]];
               //resultado[z][1]=listo[z];

            } //for z

            respuesta.render("consult/" + consulta, {
               musica: resultado
            });
         } //cierre res
         else {
            console.log(err);
         }

      } //cierre if 
   );
} //cierre 

//----------------------------------------------------------

//consulta 3 version 2---> retorna un arreglo de arreglos de 2 posicones 0=nombre,1=pasatiempos
function prefe_pasa(respuesta, consulta) {
   //var type = 'Bailarsh';
   db.view('consultas', 'prefe_pasa', function(err, doc) {
         if (!err) {
            var rows = doc.rows; //the rows returned
            var nombres = [];
            valores = [];
            listo = [];
            resultado = [];

            for (i = 0; i < rows.length; i++) {
               if (rows[i]['key'] != "") {
                  nombres.push(rows[i]['key']);
               }

            } //cierre for


            for (i = 0; i < rows.length; i++) {

               valores.push(rows[i]['value']);
            }

            for (x = 0; x < valores.length; x++) {
               if (valores[x] == "") {
                  listo[x] = "Sin Asignar";
               } else {
                  var pasa = "pasatiempo";
                  var agregar = "";
                  for (m = 0; m < valores[x].length; m++) {
                     if (m == 0) {
                        pasa = valores[x][m];

                     } else {
                        agregar = "," + valores[x][m];
                        pasa = pasa + agregar;
                        //console.log(agregar);
                        //console.log(pasa);

                     }

                  } //cierre for
                  listo[x] = pasa;
               }
            } //cierre for x
            //console.log(listo);
            for (z = 0; z < listo.length; z++) {
               resultado[z] = [nombres[z], listo[z]];
               //resultado[z][1]=listo[z];

            } //for z
         } //cierre res
         
         respuesta.render("consult/" + consulta, {
            pasatiempos: resultado
         });
      } //cierre if 
   );
} //cierre 

//----------------------------------------------------------

var mem = [
   ["1"],
   ["2"],
   ["3"]
];

function llenar_combo1(respuesta,consulta) {
   //var type = 'Bailarsh';

   var resultado = [];
   //var respuesta;
   db.view('consultas', 'get_comida', {
         'group': true
      }, function(err, doc) {

         if (!err) {
            var rows = doc.rows; //the rows returned
            //console.log(rows);


         } //cierre if



         for (i = 0; i < rows.length; i++) {
            if (rows[i]['key'] != "") {
               resultado.push(rows[i]['key']);
            }

         } //cierre for
         //console.log(mem);
         mem[0] = resultado;
         //mem[0]="wa"
         //console.log(mem);
         //return mem;

         db.view('consultas', 'get_musica', {
               'group': true
            }, function(err, doc) {

               if (!err) {
                  var rows = doc.rows; //the rows returned
                  //console.log(rows);


               } //cierre if

               var resultado = [];

               for (i = 0; i < rows.length; i++) {
                  if (rows[i]['key'] != "") {
                     resultado.push(rows[i]['key']);
                  }

               } //cierre for
               mem[1] = resultado;
               //console.log(mem);
               //return resultado
            } //cierre res
         );

         db.view('consultas', 'get_pasa', {
               'group': true
            }, function(err, doc) {

               if (!err) {
                  var rows = doc.rows; //the rows returned
                  //console.log(rows);


               } //cierre if

               var resultado = [];

               for (i = 0; i < rows.length; i++) {
                  if (rows[i]['key'] != "") {
                     resultado.push(rows[i]['key']);
                  }

               } //cierre for
               //console.log(resultado);
               mem[2] = resultado;
               respuesta.render("consult/" + consulta, {
                   lista: mem
               });

               //return resultado
            } //cierre res
         );

      } //cierre res
   );
} //cierre

// ---------------------- Rutas ----------------------------- //
app.get("/", function(solicitud, respuesta) {
   respuesta.render("./index");
});

app.get("/index", function(solicitud, respuesta) {
   respuesta.render("./index");
});

app.get("/consult", function(solicitud, respuesta) {
   respuesta.render("consult/consulta")
});

app.get("/consult/consulta1", function(solicitud, respuesta) {
   get_clientes(respuesta, "consulta1");
});

app.get("/consult/consulta2", function(solicitud, respuesta) {
   get_pasa(respuesta, "consulta2");
});

app.get("/consult/consulta3", function(solicitud, respuesta) {
   get_pasa(respuesta, "consulta3");
});

app.get("/consult/consulta32", function(solicitud, respuesta) {
   prefe_pasa(respuesta, "consulta32");
});

app.get("/consult/consulta4", function(solicitud, respuesta) {
   get_musica(respuesta, "consulta4");
});

app.get("/consult/consulta42", function(solicitud, respuesta) {
   prefe_musica(respuesta, "consulta42");
});

app.get("/consult/consulta5", function(solicitud, respuesta) {
   get_musica(respuesta, "consulta5");
});

app.get("/consult/consulta6", function(solicitud, respuesta) {
   get_comida(respuesta, "consulta6");
});

app.get("/consult/consulta62", function(solicitud, respuesta) {
   prefe_comida(respuesta, "consulta62");
});

app.get("/consult/consulta7", function(solicitud, respuesta) {
   get_comida(respuesta, "consulta7");
});

app.get("/consult/consulta8", function(solicitud, respuesta) {
   llenar_combo1(respuesta,"consulta8");
});


app.get("/consult/comidas", function(solicitud, respuesta) {
   get_comida(respuesta,"comidas");
});

app.get("/consult/musica", function(solicitud, respuesta) {
   get_musica(respuesta,"musica");
});

app.get("/consult/pasatiempos", function(solicitud, respuesta) {
   get_pasa(respuesta,"pasatiempos");
});


app.get("/consult/comidasR/:comida", function(solicitud, respuesta) {
   var com = solicitud.params.comida;
   count_comida(com,respuesta,"comidasR");
});

app.get("/consult/musicaR/:musica", function(solicitud, respuesta) {
   var mus = solicitud.params.musica;
   count_musica(mus,respuesta,"musicaR");
});

app.get("/consult/pasatiemposR/:pasatiempo", function(solicitud, respuesta) {
   var pass = solicitud.params.pasatiempo;
   count_pasatiempos(pass,respuesta,"pasatiemposR");
});




app.post("/eventos", function(solicitud, respuesta) {
   console.log(solicitud.body);
   var comi = solicitud.body.comida.split(",");
   var music = solicitud.body.musica.split(",");
   var hobbies = solicitud.body.pasatiempos.split(",");
   var doc = {

      nombre: solicitud.body.nombre,
      correo: solicitud.body.correo,
      comida: comi,
      musica: music,
      pasatiempos: hobbies
   }

   insert_doc(doc);
   respuesta.render("eventos/newEvent");
});

app.get("/eventos/newEvent", function(solicitud, respuesta) {
   respuesta.render("eventos/newEvent");
});

app.get("/consult/consulta1r/:clienteCorreo", function(solicitud,respuesta){
     var c = solicitud.params.clienteCorreo;
     busqueda_cliente(c,respuesta,"consulta1r");
});
 
app.get("/consult/consulta2r/:pasatiempos", function(solicitud,respuesta){
     var p = solicitud.params.pasatiempos;
     clientes_pasatiempo(p,respuesta,"consulta2r");
});


app.get("/consult/consulta5r/:musica", function(solicitud,respuesta){
     var p = solicitud.params.musica;
     clientes_musica(p,respuesta,"consulta5r");
});

app.get("/consult/consulta7r/:comidas", function(solicitud,respuesta){
     var p = solicitud.params.comidas;
     clientes_comida(p,respuesta,"consulta7r");
});
 

// escucha puerto 8080
var server = app.listen(8080);




