import { CardActions, CardContent, Container } from '@mui/material';
import React from 'react';
import { SmallButton } from '../../styles/buttons';
import ReviewImg from '../common/ReviewImg';
import { SyCard } from './WorkerProfileStyle';
import {
  ReviewDiv,
  ReviewHeader,
  ReviewImgDiv,
  ReviewName
} from './WorkerReviewsStyle';

export default function MyConversations({
  myConversations,
  openConversation,
  openProposalRequest
}) {
  return (
    <>
      {myConversations.map((conversation) => (
        <Container key={conversation._id} style={{ padding: '20px' }}>
          <SyCard>
            <CardContent style={{ display: 'contents' }}>
              <ReviewImgDiv>
                <ReviewImg
                  userId={conversation._receiver._id}
                  userType="neighbour"
                />
              </ReviewImgDiv>
              <ReviewDiv>
                <ReviewHeader>
                  <ReviewName>
                    {conversation._receiver.name}{' '}
                    {conversation._receiver.lastName}
                  </ReviewName>
                </ReviewHeader>
              </ReviewDiv>
            </CardContent>

            <CardActions>
              <SmallButton onClick={() => openConversation(conversation)}>
                Ver conversacion
              </SmallButton>
              <SmallButton onClick={() => openProposalRequest(conversation)}>
                Enviar presupuesto
              </SmallButton>
            </CardActions>
          </SyCard>
        </Container>
      ))}
    </>
  );
}
