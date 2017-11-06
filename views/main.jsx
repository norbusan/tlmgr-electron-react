'use babel';

import React from 'react';

export default class Main extends React.Component {
  render() {
    return (
      <div className="mainFrame">
        <div className="panel">
          <Header />
          <PkgPanes />
          <Expert />
          <Debug />
        </div>
      </div>
    );
  }
}

export class Header extends React.Component {
  render() { return (<BusyIndicator />); }
}
export class BusyIndicator extends React.Component {
  render() { return (<div className="idle-indicator"><span id="text">Status: </span><span id="value">Idle</span></div>) }
}
export class Debug extends React.Component {
  render() { return (<div className="debug">debug: TODO</div>) }
}
export class Expert extends React.Component {
  render() { return (<div className="expert">expert: TODO</div>) }
}
export class PkgPanes extends React.Component {
  render() { return (<div className="pkg-panes">pkg panes: TODO</div>) }
}

