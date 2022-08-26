import React, { Component } from 'react';
import { logout } from '../../services/authService';

export default class Logout extends Component {
  componentDidMount() {
    logout();
    this.props.history.push('/');
    return;
  }
  render() {
    return <></>;
  }
}
