/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



 function conexion(){

     db = window.openDatabase('amigodb', '', 'Base de datos amigos.', 2000000, function(db) {});

 }

 function okdata(){

     alert("ok");
 }

 function errordata(){

     alert("error");
 }

 function notas(){

         $(".notaslista").on('click',function(){
                var id = $(this).attr('dataid');
                /*alert("tarea"+id);*/

                db.transaction(function(tx) {
                 tx.executeSql('SELECT * FROM notas WHERE id='+id, [], function (tx, results) {
                     var len = results.rows.length, i;
                             /*alert(results.rows.item(0).id +"-"+ results.rows.item(0).idnotas +"-"+ results.rows.item(0).nombre);*/
                             $('#idnota').val(results.rows.item(0).id);
                             $('#idamigonota').val(results.rows.item(0).idnotas);
                             $('#nombrenota').val(results.rows.item(0).nombre);




                 });
                });



         });

         $("#nuevanota").on('click',function(){

                 var idnota = $('#idnota').val();
                 var idamigonota = $('#idamigonota').val();
                 var nombrenota = $('#nombrenota').val();




                  db.transaction(function (tx) {

                             tx.executeSql('UPDATE notas' + ' SET idnotas = ?, nombre = ?' + ' WHERE id='+idnota,
                             [idamigonota,nombrenota],okdata, errordata);

                  });



         });



 }

function lamigos(){

    $(".amigoslistado").on('click',function(){

        var id = $(this).attr('dataid');
        document.getElementById('formulario').style.display = 'block';
        document.getElementById('contenido').style.display = 'none';

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM amigos10 WHERE id='+id, [], function (tx, results) {
            var len = results.rows.length, i;

               $('#idamigo').val(results.rows.item(0).id);
               $('#nombre').val(results.rows.item(0).nombre);
               $('#apellidos').val(results.rows.item(0).apellidos);

            });
        });


        $("#datalistnotas").empty();
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM notas WHERE idnotas='+id, [], function (tx, results) {
                var len = results.rows.length, i;

                for (i = 0; i < len; i++){
                    $("#datalistnotas").append('<li class="notaslista" dataid="'+results.rows.item(i).id+'" ><a href="#">'+results.rows.item(i).id+"-"+results.rows.item(i).nombre+"-"+'</a></li>').listview().listview('refresh');

                }

                notas();

            });
        });










    });


}


function gamigosedit(){




     lamigos();

     $("#volver").click(function(){

            document.getElementById('contenido').style.display = 'block';
            document.getElementById('formulario').style.display = 'none';


     });


    $("#guardar").click(function(){

    alert("guardar");


     var idformu = $('#idamigo').val();
     var nombre = $('#nombre').val();
     var apellidos = $('#apellidos').val();



     alert("guardar--"+idformu+nombre+apellidos);


     db.transaction(function (tx) {

         tx.executeSql('UPDATE amigos10' + ' SET nombre = ?, apellidos = ?' + ' WHERE id='+idformu,[nombre,apellidos], okdata, errordata);

     });

     $("#amigos").empty();


    db.transaction(function(tx) {
         tx.executeSql('SELECT * FROM amigos10', [], function (tx, results) {
             var len = results.rows.length, i;
             for (i = 0; i < len; i++){
                 $("#amigos").append('<li class="amigoslistado" dataid="'+results.rows.item(i).id+'" ><a href="#">'+results.rows.item(i).id+"-"+results.rows.item(i).nombre+"-"+results.rows.item(i).apellidos+'</a></li>').listview().listview('refresh');

             }


              lamigos();


         });
    });


    });




}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('formulario').style.display = 'none';

        conexion();

        db.transaction(function (tx) {

            /*tx.executeSql('DROP TABLE IF EXISTS DEMO');*/


            tx.executeSql('CREATE TABLE IF NOT EXISTS amigos10 (id INTEGER PRIMARY KEY ASC AUTOINCREMENT, nombre TEXT, apellidos TEXT)');
            /*tx.executeSql('INSERT INTO amigos10 (nombre, apellidos) values (?,?)',["Cristiano", "Ronaldo"]);*/

            tx.executeSql('CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY ASC AUTOINCREMENT, idnotas TEXT, nombre TEXT)');

            /*tx.executeSql('INSERT INTO notas (idnotas, nombre) values (?,?)',["1", "notaprueba"], okdata, errordata);*/





        });


        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM amigos10', [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++){
                    $("#amigos").append('<li class="amigoslistado" dataid="'+results.rows.item(i).id+'" ><a href="#">'+results.rows.item(i).id+"-"+results.rows.item(i).nombre+"-"+results.rows.item(i).apellidos+'</a></li>').listview().listview('refresh');

                }


                gamigosedit();


            });
        });


    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
