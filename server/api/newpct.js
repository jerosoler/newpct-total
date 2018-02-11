import { Router } from 'express'
const fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var exec = require('child_process').exec;


const router = Router()



/* GET series listidao. */
router.get('/listado', function (req, res, next) {
  if(!req.query.busquedalista) {

    if(req.query.busqueda == '') {
      req.query.busqueda = 'Buscar aqui..';
    }

    var url = 'http://www.newpct.com/?page=buscar&q='+req.query.busqueda;
    if(!req.query.page) {
       url = 'http://www.newpct.com/?page=buscar&q='+req.query.busqueda+'&calidad='+req.query.calidad;
    } else {
      url = 'http://www.newpct.com/?page=buscar&q='+req.query.busqueda+'&pg='+req.query.page+'&calidad='+req.query.calidad;
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
        urltorrent = textofiltrar.match(/http:\/\/.*?\.html/);
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
