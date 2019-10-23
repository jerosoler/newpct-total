import { Router } from 'express'
const fs = require('fs');
var axios = require('axios');
var request = require('request');
var cheerio = require('cheerio');
var exec = require('child_process').exec;


const router = Router()

function escapeRegExp(string){
  return string.replace(/([*+?^=!${}()|\[\]\/\\])/g, "\\$1");
}

/* GET series listidao. */
router.get('/listado', function (req, res, next) {
  /*if(!req.query.busquedalista) {

    if(req.query.busqueda == '') {
      req.query.busqueda = '';
    }

    var url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+req.query.busqueda;
    if(!req.query.page) {
       url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+req.query.busqueda+'&calidad='+req.query.calidad;
    } else {
      url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+req.query.busqueda+'&pg='+req.query.page+'&calidad='+req.query.calidad;
    }

  } else {
    var url = req.query.busquedalista;
  }

  console.log('URL final: '+ url);
  request(url, function (error, response, html) {

    if (!error && response.statusCode == 200) {
      //item_count2++;
      var $ = cheerio.load(html);

      var  lista = [];
      var paginacion = [];

      var listabuscada = $(".buscar-list .info > a").each(function (){
        //var titulo = $(this).attr('title');
        var titulo = $(this).children("h2").html();
        if(!req.query.busquedalista) {
          var view = titulo.indexOf("color:red");
        } else {
          var view = -1;
        }


        titulo = titulo.replace(/color:red/g, 'color:black');
        var imagen = $(this).parent().parent("li").children("a").children("img").attr('src');
        var linkp = $(this).attr('href');
        lista.push([titulo, linkp, view, imagen]);
      });

      var paginacionbuscada = $(".pagination > li > a").each(function (){
        //var titulo = $(this).attr('title');
        var pagina = $(this).text();
        var classe = $(this).attr('class');

        if(pagina != "Next" && pagina != "Last" && pagina != "First" && pagina != "Prev") {
          paginacion.push([pagina, classe]);
       }
      });



      res.json({ lista:lista,  paginacion: paginacion  });
    } else {
      console.log("error");
    }
  });
  */
  console.log("BUSQUEDA");

  if(req.query.busqueda == "") {
    req.query.busqueda = "descargas2020";
  }

  /*axios.post(''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'/get/result/', {
      s: req.query.busqueda
    })*/
    request.post({
      headers: {'content-type' : 'application/x-www-form-urlencoded'},
      url:     JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'/get/result/',
      body:    "s="+req.query.busqueda+"&calidad="+req.query.calidad+"&pg="+req.query.page+"",
      json: true,
    }, function(error, response, body){
      //console.log(response);
      var lista = [];
      var listatorrents = body.data.torrents[0];
      //listatorrentsnum = JSON.parse(listatorrents);
      //console.log(listatorrents);
      if(listatorrents != null) {
        var listatorrentsnum = Object.keys(listatorrents).length;
      } else {
        var listatorrentsnum = 0;
      }

      for(var i=0; i < listatorrentsnum;i++) {
          var titulo = listatorrents[i].torrentName;
          //console.log(titulo);
          var linkp = JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+"/"+listatorrents[i].guid;
          var view = linkp.indexOf("series");
          var imagen = JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+listatorrents[i].imagen;
          lista.push([titulo, linkp, view, imagen]);
      }

      res.json({ lista:lista, paginacion:body.data.all  });


    })



});


/*GET SERIE LISTADO*/
router.get('/listadoserie', function (req, res, next) {
  if(!req.query.busquedalista) {

    if(req.query.busqueda == '') {
      req.query.busqueda = '';
    }

    var url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+req.query.busqueda;
    if(!req.query.page) {
       url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+req.query.busqueda+'&calidad='+req.query.calidad;
    } else {
      url = ''+JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url+'?page=buscar&q='+req.query.busqueda+'&pg='+req.query.page+'&calidad='+req.query.calidad;
    }

  } else {
    var url = req.query.busquedalista;
  }

  console.log('URL final: '+ url);
  request(url, function (error, response, html) {

    if (!error && response.statusCode == 200) {
      //item_count2++;
      var $ = cheerio.load(html);

      var  lista = [];
      var paginacion = [];

      var listabuscada = $(".buscar-list .info > a").each(function (){
        //var titulo = $(this).attr('title');
        var titulo = $(this).children("h2").html();
        if(!req.query.busquedalista) {
          var view = titulo.indexOf("color:red");
        } else {
          var view = -1;
        }


        titulo = titulo.replace(/color:red/g, 'color:black');
        var imagen = $(this).parent().parent("li").children("a").children("img").attr('src');
        var linkp = $(this).attr('href');
        lista.push([titulo, linkp, view, imagen]);
      });

      var paginacionbuscada = $(".pagination > li > a").each(function (){
        //var titulo = $(this).attr('title');
        var pagina = $(this).text();
        var classe = $(this).attr('class');

        if(pagina != "Next" && pagina != "Last" && pagina != "First" && pagina != "Prev") {
          paginacion.push([pagina, classe]);
       }
      });



      res.json({ lista:lista,  paginacion: paginacion  });
    } else {
      console.log("error");
    }
  });


});



router.post('/addtorrent', function(req, res, next) {
  console.log('LLamado: '+ req.body.params.url);

  request(req.body.params.url, function (error, response, html) {
    if (!error && response.statusCode == 200) {

      //item_count2++;
      var $ = cheerio.load(html);

      //var urltorrent = $("#content-torrent > a").attr("href");
      var urltorrent = '';
      var textofiltrar = $("#tab1 script").html();
      if(textofiltrar != null) {
        //urltorrent = textofiltrar.match(/http:\/\/.*?\.html/);
        var palabra = escapeRegExp(JSON.parse(fs.readFileSync('./db.json', 'utf8')).urlsearch.url)
        if(palabra.startsWith("https")) {
          palabra = palabra.substr(6);
        }
        if(palabra.startsWith("http")) {
          palabra = palabra.substr(5);
        }
        var regex = ''+palabra+'.*?\\"';
        var rgxp = new RegExp(regex);
        //urltorrent = textofiltrar.match(/http:\/\/tumejortorrent.*?\"/);
        urltorrent = textofiltrar.match(rgxp);
        console.log('hey')
        console.log(regex)
        console.log(urltorrent)

        urltorrent = urltorrent[0].slice(0,urltorrent[0].length-1);

        if(urltorrent.startsWith("//")) {
            urltorrent = 'https:'+urltorrent;
        }


      } else {
        res.json({ error: 'No se ha podido encontrar el torrent' });
      }


        var response = JSON.parse(fs.readFileSync('./db.json', 'utf8')).transmission;

        if(response.active == false ) {
          exec('transmission-remote -a ' + urltorrent, function (error, stdout, stderr) {
              if(error) {
                res.json({ error: error + stderr });
                return;
              }
              if(stdout) {
                //  console.log(stdout);
                  res.json({ okey: 'Añadido', error: 'NO' });
              }
              if(stderr) {
                res.json({ error: stderr });
                  return;
              }
          });
        } else {
          exec('transmission-remote -n \''+response.user+':'+response.pass+'\' -a ' + urltorrent, function (error, stdout, stderr) {
              if(error) {
                res.json({ error: error + stderr });
                return;
              }
              if(stdout) {
                //  console.log(stdout);
                  res.json({ okey: 'Añadido', error: 'NO' });
              }
              if(stderr) {
                res.json({ error: stderr });
                  return;
              }
          });
        }



    } else {
      res.json({ error: 'Pagina no encontrada no encontrada' });
    }
  });



});



router.get('/info', function (req, res, next) {
  var url = req.query.page;
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var video = $(".entry-right iframe").attr('src');
    var descripcion = $(".entry-right .descripcion_top").text();

    res.json({video: video, descripcion: descripcion});
  } else {
    console.log("error");
    res.json({info: 'Error'});
  }
  });
})

export default router
