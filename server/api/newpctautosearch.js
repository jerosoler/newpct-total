const fs = require('fs');
const http = require('http');
const crontab = require('node-crontab');
const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
var exec = require('child_process').exec;





telegram("Auto Downloader Start Search");

var jobId = crontab.scheduleJob("*/10 * * * *", function(){

var busqueda =  JSON.parse(fs.readFileSync('./db.json', 'utf8')).lista;

function SearchInList(lastitem) {
  var encontrado = false;
  for(i in busqueda) {
      var palabras_buscar = busqueda[i].filtro.length;
      var palabras_encontradas = 0;
      busqueda2 = busqueda[i].filtro
      lastitem = lastitem.toLowerCase()
      for (n in busqueda2) {
          var x = lastitem.indexOf(busqueda[i].filtro[n].toLowerCase())
          if(x >= 0){
            palabras_encontradas++;
          }
      }
      if(palabras_buscar === palabras_encontradas) {
        encontrado = true;
      }
  }
  return encontrado;
}

var busquedarapida = 'Buscar aqui..';
var url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+busquedarapida;


request(url, function (error, response, html) {

  if (!error && response.statusCode == 200) {
    //item_count2++;
    var $ = cheerio.load(html);

    var  lista = [];
    var paginacion = [];

    var listabuscada = $(".buscar-list .info > a").each(function (){
      //var titulo = $(this).attr('title');
      var titulo = $(this).children("h2").html();
      var titulo2 = $(this).children("h2").text();
    //  if(!req.query.busquedalista) {
        var view = titulo.indexOf("color:red");
    /*  } else {
        var view = -1;
      }*/


      //titulo = titulo.replace(/color:red/g, 'color:black');
      var linkp = $(this).attr('href');
      lista.push([titulo2, linkp, view]);
    });


    //Aqui ya tenemos la lista! Vamos a filtra! ;)
    //Recordatorio [Titulo texto, enlace, -1 Pelicula otros serie ]
    var lastitem =  JSON.parse(fs.readFileSync('./db.json', 'utf8')).ultimabusqueda.fecha;
    var stopsearch = 0;
    for (x=0;x<lista.length;x++){

      var d = new Date();

      if(x==0) {
        request({ url: 'http://localhost:3001/ultimabusqueda', method: 'PUT', json: {fecha: lista[x][0]}});
      }

      if(lastitem == lista[x][0]) {
        stopsearch = 1;
      }
      if(stopsearch == 0) {
        console.log(x + "-" + lista[x][0] + " - " + d);
      //console.log(x);
        var searchtrue = SearchInList(lista[x][0]);
        if(searchtrue) {
          //enviamos a torrent
          telegram("Encontrado: " + lista[x][0]);
          if(lista[x][2] > -1) {
            addtorrentserie(lista[x][1], lista[x][0]);
          } else {
            addtorrent(lista[x][1], lista[x][0]);
          }

        }
      }
    }

  } else {
    console.log("error");
  }
});


}); // FIN CRON JOB




function telegram(message) {
  if(JSON.parse(fs.readFileSync('./db.json', 'utf8')).telegram.active){
    message = encode_utf8(message);
    request('https://api.telegram.org/bot'+JSON.parse(fs.readFileSync('./db.json', 'utf8')).telegram.api+'/sendMessage?chat_id='+JSON.parse(fs.readFileSync('./db.json', 'utf8')).telegram.user+'&text='+message+'', function (error, response, body) {
      if(error){
        console.log('error:', error)
      }
    });
  }
}

function escapeRegExp(string){
  return string.replace(/([*+?^=!${}()|\[\]\/\\])/g, "\\$1");
}



function addtorrentserie(url, name) {
//console.log("Serie");

  request(url, function (error, response, html) {

    if (!error && response.statusCode == 200) {
      //item_count2++;
      var $ = cheerio.load(html);

      var  lista = [];
      var paginacion = [];

      var listabuscada = $(".buscar-list .info > a").each(function (){
        //var titulo = $(this).attr('title');
        var titulo2 = $(this).children("h2").text();
      //  if(!req.query.busquedalista) {
      /*  } else {
          var view = -1;
        }*/


        //titulo = titulo.replace(/color:red/g, 'color:black');
        var linkp = $(this).attr('href');
        lista.push([titulo2, linkp]);
      });


      //Aqui ya tenemos la lista! Vamos a filtra! ;)
      //Recordatorio [Titulo texto, enlace, -1 Pelicula otros serie ]
      for (x=0;x<lista.length;x++){

        var nombre = lista[x][0];
        nombre = nombre.substring(6, nombre.lenght);
        nombre = nombre.replace("-", "");
        nombre = nombre.replace("Calidad ", " Calidad de la Serie ");
        console.log(nombre + "-"+ name);
        if(nombre == name) {
          //console.log("igual");
          addtorrent(lista[x][1], lista[x][0]);
        }

      }




    } else {
      console.log("error");
    }
  });

}

function addtorrent(url, name) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      //item_count2++;
      var $ = cheerio.load(html);

      var urltorrent = '';
      var textofiltrar = $("#tab1 script").html();
      if(textofiltrar != null) {
        //urltorrent = textofiltrar.match(/http:\/\/.*?\.html/);
        var palabra = escapeRegExp(JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url)
        var regex = ''+palabra+'.*?\\"';
        var rgxp = new RegExp(regex);
        //urltorrent = textofiltrar.match(/http:\/\/tumejortorrent.*?\"/);
        urltorrent = textofiltrar.match(rgxp);

        urltorrent = urltorrent[0].slice(0,urltorrent[0].length-1);
      }
      console.log('urltorrent' + urltorrent);


        var response = JSON.parse(fs.readFileSync('./db.json', 'utf8')).transmission;

        if(response.active == false ) {
          exec('transmission-remote -a ' + urltorrent, function (error, stdout, stderr) {
            if(error) {
             telegram("ERROR: "+name + " Type Error1:" + error);
             return;
           } else if(stderr) {
              telegram("ERROR: "+name + " Type Error2:" + stderr);
           } else if(stdout) {
              telegram("Descargando: "+name);
            }
          });
        } else {
          exec('transmission-remote -n \''+response.user+':'+response.pass+'\' -a ' + urltorrent, function (error, stdout, stderr) {
              if(error) {
               telegram("ERROR: "+name + " Type Error1:" + error);
               return;
             } else if(stderr) {
                telegram("ERROR: "+name + " Type Error2:" + stderr);
             } else if(stdout) {
                telegram("Descargando: "+name);
              }
          });
        }


    }
  });
}
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}
