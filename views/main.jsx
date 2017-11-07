'use babel';

import React from 'react';
import PackageTable from './package-table';

export default class Main extends React.Component {
  render() {
    const {tlm} = this.props;

    return (
      <div className="mainFrame">
        <div className="panel">
          <Header />
          <PackageTable tlm={tlm} />
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
  render() { return (<div className="idle-indicator"><span className="idle-front">Status: </span><span className="idle-value">Idle</span></div>) }
}
export class Debug extends React.Component {
  render() { return (<div className="debug">debug: TODO</div>) }
}
export class Expert extends React.Component {
  render() { return (<div className="expert">expert: TODO</div>) }
}

