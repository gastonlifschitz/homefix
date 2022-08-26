import { CardActions, CardContent, Container } from '@mui/material';
import React, { useState } from 'react';
import { SButton } from '../../styles/buttons';
import ChatPage from '../ChatPage';
import ReviewImg from '../common/ReviewImg';
import { SyCard } from '../WorkerProfile/WorkerProfileStyle';
import {
  ReviewDescription,
  ReviewDiv,
  ReviewHeader,
  ReviewImgDiv,
  ReviewName
} from '../WorkerProfile/WorkerReviewsStyle';

export default function ChatCard({ chatInfo, neighbour }) {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div>
      <Container style={{ padding: '20px' }}>
        <SyCard>
          <CardContent style={{ display: 'contents' }}>
            <ReviewImgDiv>
              <ReviewImg userId={chatInfo._provider._id} userType="employee" />
            </ReviewImgDiv>
            <ReviewDiv>
              <ReviewHeader>
                <ReviewName>{chatInfo._provider.name}</ReviewName>
              </ReviewHeader>

              {chatInfo._provider.rubros.map((rubro, index) => (
                <ReviewDescription key={index}>
                  {rubro.rubroType}{' '}
                </ReviewDescription>
              ))}
            </ReviewDiv>
          </CardContent>
          <CardActions>
            <SButton onClick={() => setOpenChat(true)}>Ver Chat</SButton>
          </CardActions>
        </SyCard>
      </Container>
      {openChat ? (
        <ChatPage
          employee={chatInfo._provider}
          neighbour={neighbour}
          openDialog={openChat}
          handleCloseDialog={() => setOpenChat(false)}
          amIEmployee={false}
        />
      ) : null}
    </div>
  );
}
