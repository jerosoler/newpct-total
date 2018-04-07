import { Router } from 'express'

import newpct from './newpct'
//import newpctauto from './newpctauto'
import newpctautosearch from './newpctautosearch'
import streaming from './streaming'

const fs = require('fs');

const router = Router()

// Add USERS Routes
router.use(newpct)
router.use(streaming)

router.get('/backup', function(req,res,next){
  res.download('./db.json');
});

router.get('/loginvalido', function(req, res, next) {
  var loggin = JSON.parse(fs.readFileSync('./db.json', 'utf8')).privateapp;
  if(loggin.active) {
    res.json({ error: "activado" });
  } else {
    res.json({ error: "noactivado" });
  }
});


router.post('/login', function(req, res, next) {
  var loggin = JSON.parse(fs.readFileSync('./db.json', 'utf8')).privateapp;
  if(loggin.user == req.body.params.user && loggin.pass == req.body.params.pass) {
    res.json({ error: "VALIDO" });
  } else {
    res.json({ error: "ERROR" });
  }
});


export default router
