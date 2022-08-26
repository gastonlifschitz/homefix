import React, { Component } from 'react';
import { activateAccount } from '../../services/apiService';

export default class AccountActivation extends Component {
  constructor(props) {
    super(props);
    const { token } = this.props.match.params;
    if (!token) {
      this.props.history.push('/');
      return;
    }
    this.state = {
      token
    };
  }
  async componentDidMount() {
    const { token } = this.state;

    if (!token) return;
    await activateAccount({ token });
    this.props.history.push('/login');
  }
  render() {
    return <></>;
  }
}
