
'use strict';

const events = require('events');
const fs = require("fs");
const { spawn } = require('child_process');

// should that be var?
var tlmgr;
var lastResponse = [];
var lastReturnCode;

var tlmgrBusy = false;

var tlmgrStatus = new events.EventEmitter();

// for much later - a line-by-line updated of the GUI when packages
// are updated/installed/removed by reacting to the line-by-line
// events
var tlmgrOutputLine = new events.EventEmitter();

tlmgrOutputLine.on('data', (l) => { 
  // console.log("line listener: " + l); 
});

function get_tlmgr() {
  return(tlmgr);
}

function default_handler(data) {
  console.log(`got ==${data}== from tlmgr`);
}

function set_tlmgr_busy() {
  console.log("setting tlmgr busy");
  tlmgrBusy = true;
  tlmgrStatus.emit('statusChange', 'busy');
}
function set_tlmgr_idle() {
  console.log("setting tlmgr idle");
  tlmgrBusy = false;
  tlmgrStatus.emit('statusChange', 'idle');
}

function startTlmgr() {
  console.log("Starting tlmgr shell!");
  tlmgr = spawn('tlmgr', ['shell', '--machine-readable']);
  set_tlmgr_busy();
  tlmgr.stdout.setEncoding('utf8');
  tlmgr.stderr.setEncoding('utf8');
  tlmgr.stdin.setEncoding('utf8');
  tlmgr.stdout.on('finish', function() {
    console.log("stdout of tlmgr finished!");
  });
  tlmgr.stderr.on('finish', function() {
    console.log("stderr of tlmgr finished!");
  });
  tlmgr.stdin.on('finish', function() {
    console.log("stdin of tlmgr finished!");
  });
  // don't set default data handlers and keep
  // stdout stream in paused mode so that we can
  // control the reading
  // tlmgr.stdout.on('data', default_handler);
  tlmgr.stdout.on('readable', tlmgr_output_handler);
  tlmgr.stderr.on('data', default_handler);
  tlmgr.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function stopTlmgr() {
  tlmgr.stdin.write("quit\n");
}

function tlmgr_output_handler() {
  let chunk;
  let foundPrompt = false;
  while (null !== (chunk = tlmgr.stdout.read())) {
    var lines = chunk.split("\n");
    // console.log(`DEBUG: got chunk ${chunk}`);
    for (let l of lines) {
      // console.log(`DEBUG: working on line ==${l}==`);
      if (l == "tlmgr> ") {
        // console.log("found promtp!!!");
        foundPrompt = true;
      } else {
        if (l !== "") {
          if (foundPrompt) {
            console.log(`found output after prompt?: ==${l}==`);
          }
          if (l == "OK") {
            // console.log("Setting returncode to OK");
            lastReturnCode = l;
          } else if (l == "ERROR") {
            // console.log("Setting returncode to ERROR");
            lastReturnCode = l;
          } else {
            lastResponse.push(l);
            tlmgrOutputLine.emit('data', l);
          }
        }
      }
    }
  }
  if (foundPrompt) {
    set_tlmgr_idle();
  }
}



function send_receive(str) {
  if (tlmgrBusy) {
    console.log("tlmgr busy, not doing anything - rejecting command!");
    return(undefined);
  }
  var promise = new Promise(function(resolve, reject) {
    // clear out lastResonse etc
    lastResponse = [];
    lastReturnCode = undefined;
    // change the tlmgr status before installing the statusChange handler
    if (str !== "") {
      set_tlmgr_busy();
    }
    tlmgrStatus.on('statusChange', (s) => {
      if (s === "idle") {
        resolve(lastReturnCode);
      } else {
        reject(lastReturnCode);
      }
    });
    if (str !== "") {
      tlmgr.stdin.write(str + "\n");
    }
  });
  var fff = promise.then(function(result) {
    console.log("SUCCESS RESULT CODE: " + result);
    // console.log("LAST DATA = " + lastResponse.join("\n"));
    return({ code: result, response: lastResponse });
  }, function(err) {
    console.log("ERROR RESULT CODE: " + err);
    console.log("LAST DATA = " + lastResponse.join("\n"));
    return({ code: err, response: lastResponse });
  });
  return(fff);
}

module.exports = {
  get_tlmgr, startTlmgr, stopTlmgr, send_receive, tlmgrStatus
};
