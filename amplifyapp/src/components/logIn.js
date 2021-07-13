import React from 'react';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator } from "@aws-amplify/ui-react";
import Amplify, { API } from 'aws-amplify';

import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { ButtonGroup } from "baseui/button-group";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";
import { Input, } from 'baseui/input';
import { FormControl } from 'baseui/form-control';

class LogIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      logInModalOpen: false,
      signUpModalOpen: false,
    }
  }

  componentDidMount() {

  }

  render() {
    return  (
      <ButtonGroup size={SIZE.compact}>
        <Button onClick={() => this.setState({logInModalOpen: true})}>
          Log In
        </Button>
        <Button onClick={() => this.setState({signUpModalOpen: true})}>
          Sign Up
        </Button>
        <Modal
          isOpen={this.state.logInModalOpen}
          onClose={() => this.setState({logInModalOpen: false})}
          animate
          >
          <ModalHeader>Log In</ModalHeader>
          <ModalBody>
            <FormControl label="Email Address">
              <Input />
            </FormControl>
            <FormControl label="Password">
              <Input type='password'/>
            </FormControl>
            <ModalFooter>
              <ModalButton
                kind={KIND.secondary}
                size={SIZE.compact}
                onClick={() => this.setState({logInModalOpen: false})}>
                Cancel
              </ModalButton>
              <ModalButton kind={KIND.primary} size={SIZE.compact}>Submit</ModalButton>
            </ModalFooter>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.signUpModalOpen}
          onClose={() => this.setState({signUpModalOpen: false})}
          animate
          >
          <ModalHeader>Sign Up</ModalHeader>
          <ModalBody>
            <FormControl label="Sign Up Token">
              <Input />
            </FormControl>
            <FormControl label="Email Address">
              <Input />
            </FormControl>
            <FormControl label="Create Password">
              <Input type='password'/>
            </FormControl>
            <ModalFooter>
              <ModalButton
                kind={KIND.secondary}
                size={SIZE.compact}
                onClick={() => this.setState({signUpModalOpen: false})}>
                Cancel
              </ModalButton>
              <ModalButton kind={KIND.primary} size={SIZE.compact}>Submit</ModalButton>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </ButtonGroup>

    )
  }
};

export default LogIn;
//export default withAuthenticator(LogIn);
