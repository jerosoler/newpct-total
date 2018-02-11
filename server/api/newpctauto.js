const FeedMe = require('feedme');
const fs = require('fs');
const http = require('http');
const crontab = require('node-crontab');
const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
var exec = require('child_process').exec;


console.log("Telegram");

telegram("Auto Downloader Start")




// INICIAMOS CRON
var jobId = crontab.scheduleJob("*/30 * * * *", function(){


var item_count = 0;
var next_item = true;
var last_item_feed = '';

//Cargamos las busquedas fichero de nuevo
var busqueda =  JSON.parse(fs.readFileSync('./db.json', 'utf8')).lista;

//Leemos el último feed leido
var lastitem =  JSON.parse(fs.readFileSync('./db.json', 'utf8')).ultimabusqueda.fecha;


//Funcion para buscar si existe la concidencia: Si existe devuelve True, si no false.
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


//Leemos fichero
http.get('http://www.newpct.com/feed', function(res) {
      var parser = new FeedMe();


      parser.on('item', function(item) {
        next_item_item = true;
        // El primer item lo guardamos en variable
        if(item_count === 0) {
          last_item_feed = item.pubdate;
          }
        //Sumamos item
        item_count++;

        //Comprobamos si el Guardado en el archivo es igual que el actual
        if(new Date(lastitem).getTime() >= new Date(item.pubdate).getTime()) {

          next_item = false;
          next_item_item = false;
          //Dejamos de leer el feed para ir al Archivo END
          parser.emit("close");

        } else {
          // Comprobamos que no se ha cerrado el parseado ya que aveces devuelve algun valor más.
            if(next_item && next_item_item){
              console.log("LOG:" + lastitem + " - " + item.pubdate + "-" + new Date().getHours() + ":"+ new Date().getMinutes());
              //buscamos si esta entre los nuestros.
              var searchtrue = SearchInList(item.title);
              if(searchtrue) {
                //enviamos a torrent
                telegram("Encontrado: " + item.title);
                addtorrent(item.link, item.title);
              }
            }
        }

      });

      //Parseamos
      res.pipe(parser);

      //Fin de parsear
      parser.on('end', function() {
        //Guadamos el item en el archivo
        request({ url: 'http://localhost:3001/ultimabusqueda', method: 'PUT', json: {fecha: last_item_feed}});

        /*fs.writeFile("./lastitem.txt", last_item_feed, function (err) {
            if (err) {
              return console.log(err);
            }
          });*/

      });

      parser.on('close', function() {
        //Guadamos el item en el archivo
        request({ url: 'http://localhost:3001/ultimabusqueda', method: 'PUT', json: {fecha: last_item_feed}});
        /*fs.writeFile("./lastitem.txt", last_item_feed, function (err) {
            if (err) {
              return console.log(err);
            }
          });*/

      });

    });

}); // FIN crontab

function telegram(message) {
  if(JSON.parse(fs.readFileSync('./db.json', 'utf8')).telegram.active){
    request('https://api.telegram.org/bot'+JSON.parse(fs.readFileSync('./db.json', 'utf8')).telegram.api+'/sendMessage?chat_id='+JSON.parse(fs.readFileSync('./db.json', 'utf8')).telegram.user+'&text='+message+'', function (error, response, body) {
      if(error){
        console.log('error:', error)
      }
    });
  }
}


function addtorrent(url, name) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      //item_count2++;
      var $ = cheerio.load(html);

      var urltorrent = '';
      var textofiltrar = $("#tab1 script").html();
      if(textofiltrar != null) {
        urltorrent = textofiltrar.match(/http:\/\/.*?\.html/);
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
