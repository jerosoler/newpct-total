import { Router } from 'express'

var fs = require('fs');
const path = require('path');
const request = require('request');
const videoStream = require('video-stream');
const find = require('find');

const router = Router()




//var directorio = '/home/motoraton/Documentos/proyectos/streamingvideo/';
//var directorio = JSON.parse(fs.readFileSync('./db.json', 'utf8')).streaming.dir;



router.get(['/video/:filename','/video/*/:filename','/video/*/*/:filename'],  function (req, res, next) {

  var text = decodeURI(req.originalUrl);
  text = text.replace(req.params.filename,'');

  text = text.replace("/api/video",'');
  text = decodeURI(text);
  req.params.filename = path.resolve(text + req.params.filename);
  next();


}, videoStream({ dir: path.resolve(JSON.parse(fs.readFileSync('./db.json', 'utf8')).streaming.dir) }));



router.get('/filesstreaming', function (req, res, next) {


    var response = JSON.parse(fs.readFileSync('./db.json', 'utf8')).streaming;

    if(response.active == true ) {
      var directorio = response.dir;

      find.file(/\.(avi|mkv|mp4)$/,directorio, function(files) {
        //console.log(files);
        var i = 0;
        var files_correct = [];
        while (files[i]) {
           var file_correct = files[i].replace(directorio,'');
           files_correct.push({ "peli": file_correct});
          i++;
        }
        //console.log(files_correct);
        res.json(files_correct);
      });

      }


});

export default router
