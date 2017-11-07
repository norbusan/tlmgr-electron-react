'use babel';

import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class PackageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: [],
      totalDataSize: 0,
      sizePerPage: 0,
      currentPage: 1,
      tlm: this.props.tlm
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    console.log("fetching data");
    this.state.tlm.send_receive("info --data json").then(data => {
      var pkgs = JSON.parse(data.response.join(" "))
      this.setState({
        data: pkgs,
        totalDataSize: pkgs.length,
        sizePerPage: pkgs.length,
        currentPage: 1
      })
    });
  }

  render() {
    console.log("rendering package table");
    // const options = {
    // }
    return (
      <BootstrapTable 
        data={this.state.data}
        // option={options}
        remote={ true }
        pagination={ false }
        striped hover condensed height='400px'
        scrollTop={ 'Bottom' }>
        <TableHeaderColumn dataField='name' isKey>Package</TableHeaderColumn>
        <TableHeaderColumn dataField='shortdesc'>Description</TableHeaderColumn>
        <TableHeaderColumn dataField='installed'>Installed</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default PackageTable;


