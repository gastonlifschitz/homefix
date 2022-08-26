import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { CardContent, Container } from '@mui/material';
import Rating from '@mui/material/Rating';
import moment from 'moment';
import React from 'react';
import { SPaper } from '../../styles/styles';
import ReviewImg from '../common/ReviewImg';
import { SyCard } from '../WorkerProfile/WorkerProfileStyle';
import {
  ReviewDescription,
  ReviewDiv,
  ReviewHeader,
  ReviewImgDiv,
  ReviewName
} from '../WorkerProfile/WorkerReviewsStyle';
export default function ReviewCard({ review }) {
  if (!review) return <></>;

  const employeeId = review._employee._id
    ? review._employee._id
    : review._employee;

  return (
    <div>
      <Container id="reviewCard">
        <SyCard>
          <CardContent style={{ display: 'contents' }}>
            <ReviewImgDiv>
              <ReviewImg userId={employeeId} userType="employee" />
            </ReviewImgDiv>
            <ReviewDiv>
              <ReviewHeader>
                <ReviewName>{review._employee.name}</ReviewName>
              </ReviewHeader>
              <ReviewDescription>
                {moment(review.timestamp).format('DD/MM/YYYY')}
              </ReviewDescription>
              <ReviewDescription>{review.comment} </ReviewDescription>
              <Rating value={review.rating} precision={0.5} readOnly />
            </ReviewDiv>
            <div style={{ display: 'flex' }}>
              <SPaper>
                <ThumbUpAltOutlinedIcon />
                {review.likes.length}
              </SPaper>
              <SPaper>
                <ThumbDownAltOutlinedIcon />
                {review.disLikes.length}
              </SPaper>
            </div>
          </CardContent>
        </SyCard>
      </Container>
    </div>
  );
}
