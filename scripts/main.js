import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../views/main.jsx';

const tlm = require('../scripts/tlmgrprocess');

function main() {
  tlm.startTlmgr();
  console.log(`Status of tlmgr: ${tlm.tlmgrBusy}`);
  //tlm.tlmgrStatus.on('statusChange', (s) => {
  //  document.getElementById("tlmgrstatus").innerHTML = s;
  //});

  //document.getElementById("shellcmd").addEventListener("keydown", function(e) {
  //  if (e.keyCode === 13) {
  //    console.log("Sending command: ==" + e.target.value + "==");
  //    send_to_tl_update_output(e.target.value);
  //    e.target.value = "";
  //  }
  //});

  tlm.tlmgrStatus.on('statusChange', (s) => {
    if (s === 'idle') {
      ReactDOM.render(<Main tlm={tlm}/>, document.getElementById('app'));
    }
  });
}

function shutdown() {
  tlmgr.stopTlmgr();
}
window.onload = main;
window.beforeunload = shutdown;

