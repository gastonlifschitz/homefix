// import { Button, div, Form, Icon, Input, Row } from 'antd';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import moment from 'moment';
import React, { Component } from 'react';
import io from 'socket.io-client';
import { baseURL } from '../../env.json';
import { getChats, sendChatMessage } from '../../services/apiService';
import HomefixLoading from '../common/HomefixLoading';
import ChatCard from './ChatCard';
import TextInput from './TextInput';
export default class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMessage: '',
      chats: [],
      fileRef: React.createRef(),
      image: null,
      employee: props.employee,
      neighbour: props.neighbour,
      amIEmployee: props.amIEmployee,
      isLoading: true
    };

    this.handleProfilePicClick = this.handleProfilePicClick.bind(this);
  }

  async componentDidMount() {
    const { amIEmployee, employee, neighbour } = this.state;

    // get chat from this two people
    const response = await getChats(employee._id, neighbour._id);
    this.setState({ chats: response.data });

    const URL = baseURL; //TODO: PROD AND DEV
    this.socket = io(URL);

    this.socket.emit('register', amIEmployee ? employee._id : neighbour._id);

    this.socket.on('private_chat', (data) => {
      let { chats } = this.state;

      chats.push(data);
      this.setState({ chats });
    });

    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.off('connect_error');
  }

  handleProfilePicClick() {
    const fileElem = this.state.fileRef.current;
    if (fileElem) {
      fileElem.click();
    }
  }

  handleSearchChange = (e) => {
    this.setState({
      chatMessage: e.target.value
    });
  };

  renderCards = () =>
    this.state.chats &&
    this.state.chats.map((chat, index) => (
      <ChatCard
        id="chatCardChatPage"
        key={index}
        {...chat}
        other={
          this.state.amIEmployee ? this.state.neighbour : this.state.employee
        }
        myUserType={this.state.amIEmployee ? 'Employee' : 'Neighbour'}
      />
    ));

  submitChatMessage = async (e) => {
    var { chatMessage, image, chats, amIEmployee, employee, neighbour } =
      this.state;

    e.preventDefault();
    let type = 'Text';

    if (image) type = 'Image';

    let userId = amIEmployee ? employee._id : neighbour._id;
    let userName = amIEmployee ? employee.name : neighbour.name;
    let nowTime = moment();

    const content = {
      chatMessage,
      userId,
      image,
      userName,
      nowTime,
      type,
      userType: amIEmployee ? 'Employee' : 'Neighbour',
      to: amIEmployee ? neighbour._id : employee._id
    };

    this.socket.emit('private message', content);

    // Save chat message
    await sendChatMessage(employee._id, neighbour._id, content);

    chats.push({
      ...content,
      message: chatMessage ? chatMessage : image,
      sender: amIEmployee ? employee : neighbour,
      createdAt: nowTime.toString()
    });
    this.setState({ chatMessage: '', image: null, chats });
  };

  handleChange = (event) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };

    data[event.target.id] = event.target.value;
    errors[event.target.id] = this.validateProperty(event.target);

    this.setState({ data, errors });
  };

  render() {
    const { amIEmployee, isLoading } = this.state;
    return (
      <>
        <Dialog
          open={this.props.openDialog}
          maxWidth="md"
          fullWidth
          onClose={this.props.handleCloseDialog}
        >
          <HomefixLoading isLoading={isLoading} />
          <DialogContent>
            <div className="infinite-container" style={{ height: '500px' }}>
              {this.state.chats && this.renderCards()}
              <div
                ref={(el) => {
                  this.messagesEnd = el;
                }}
                style={{ float: 'left', clear: 'both' }}
              />
            </div>
          </DialogContent>
          <DialogActions style={{ flexDirection: 'column' }}>
            {amIEmployee ? (
              <Button onClick={this.props.openProposalRequest}>
                Crear nuevo presupuesto
              </Button>
            ) : null}

            <TextInput
              submitMessage={this.submitChatMessage}
              message={this.state.chatMessage}
              handleSearchChange={this.handleSearchChange}
            ></TextInput>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
