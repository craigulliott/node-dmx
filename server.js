#!/usr/bin/env node
"use strict"

var express = require('express');
var DMX     = require('./dmx');
var cors    = require('cors')

var app = express();
var dmx = new DMX();

const UNIVERSE    = 'studio1';
const ENTTEC_IP   = '192.168.2.5';
const SERVER_PORT = 3000;

var universe = dmx.addUniverse(UNIVERSE, 'artnet', ENTTEC_IP);

app.use(express.bodyParser());
app.use(cors())

app.post('/update', function(req, res) {

  let device = req.params.device;
  console.log(`Sending commands to ${device}`);

  universe.update(req.body.commands);

  res.json({
    "recieved": true
  });
});

app.get('/test', function(req, res) {

  let device = req.params.device;
  console.log(`Starting demo for device ${device}`);

  // all values are 0 to 255
  let pan        = 0; // pan around in a circle
  let tilt       = 0; // tilt up and down
  let speed      = 0; // speed
  let brightness = 0; // brightness
  let strobe     = 0; // flashing
  let red        = 0;
  let green      = 0;
  let blue       = 0;
  let white      = 0;
  let i = 0;
  let demo = setInterval(function(){

    if (i++ >= 255) {
      universe.update({
        0: 0,
        2: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
      });
      console.log('Finished Demo');
      clearInterval(demo);
      return;
    }

    universe.update({
      0: pan++,
      2: tilt++,
      4: speed++,
      5: brightness++,
      6: strobe++,
      7: red++,
      8: green++,
      9: blue++,
      10: white++,
    });

  }, 10);

  res.json({
    "recieved": true
  });
});

app.listen(SERVER_PORT, function () {
  console.log(`Listening on port ${SERVER_PORT}`);
});

