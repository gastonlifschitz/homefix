import React, { Component } from 'react';
import Header from '../Header';
import { Container } from '../SignIn/SignInStyle';
import SignUpForm from './SignUpForm';

class SignUp extends Component {
  render() {
    return (
      <>
        <Header hideSearchBar />
        <Container>
          <SignUpForm
            {...this.props}
            properties={this.props}
            edit={false}
          ></SignUpForm>
        </Container>
      </>
    );
  }
}
export default SignUp;
