import React, { Component } from 'react';
import {
  getEmployee,
  getNeighbour,
  getProposal
} from '../../services/apiService';
import ChatPage from '../ChatPage';
import HomefixLoading from '../common/HomefixLoading';
import Header from '../Header';

export default class ContactEmployee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      employeeId: this.props.match.params.id,
      proposals: null,
      loaded: false,
      openDialog: true
    };
  }

  async componentDidMount() {
    const { employeeId, user } = this.state;

    var neighbour = await getNeighbour(user.neighbour);
    var employee = await getEmployee(employeeId);

    this.setState({
      employee: employee.data,
      neighbour: neighbour.data,
      loaded: true
    });

    await getProposal(user.neighbour, employeeId);
  }

  render() {
    return (
      <>
        <Header />
        <HomefixLoading isLoading={!this.state.loaded} />

        {this.state.loaded ? (
          <ChatPage
            employee={this.state.employee}
            openDialog={this.state.openDialog}
            handleCloseDialog={() => this.setState({ openDialog: false })}
            neighbour={this.state.neighbour}
            amIEmployee={false}
          />
        ) : null}
      </>
    );
  }
}
