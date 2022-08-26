import { CardContent, Container } from '@mui/material';
import React from 'react';
import { SyCard } from '../WorkerProfile/WorkerProfileStyle';
import {
  ReviewDescription,
  ReviewDiv,
  ReviewHeader,
  ReviewName
} from '../WorkerProfile/WorkerReviewsStyle';
export default function MessageCard({ message }) {
  return (
    <div>
      <Container>
      <SyCard>
        <CardContent style={{ display: 'contents' }}>
          <ReviewDiv>
            <ReviewHeader>
              <ReviewName>{message.title}</ReviewName>
            </ReviewHeader>

            <ReviewDescription style={{paddingRight:"0px"}}>{message.message} </ReviewDescription>
          </ReviewDiv>
        </CardContent>
      </SyCard>
      </Container>
    </div>
  );
}
