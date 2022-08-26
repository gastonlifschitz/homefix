import React from 'react';
import { baseURL } from '../../env.json';
import { MessageLeft, MessageRight } from './Message';
function ChatCard(props) {
  const profilePic =
    baseURL +
    '/api/' +
    props.userType.toLowerCase() +
    's/profilePic/' +
    (typeof props.sender === 'string' ? props.sender : props.sender._id);

  return (
    <>
      {props.userType === props.myUserType ? (
        <MessageRight
          message={props.message}
          timestamp={props.createdAt}
          photoURL={profilePic}
          displayName={props.sender.name ? props.sender.name : props.other.name}
          avatarDisp={true}
        ></MessageRight>
      ) : (
        <MessageLeft
          message={props.message}
          timestamp={props.createdAt}
          photoURL={profilePic}
          displayName={props.sender.name ? props.sender.name : props.other.name}
          avatarDisp={true}
        ></MessageLeft>
      )}
    </>
  );
}

export default ChatCard;
