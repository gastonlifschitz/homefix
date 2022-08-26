import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { CardContent, Container } from '@mui/material';
import Rating from '@mui/material/Rating';
import moment from 'moment';
import React from 'react';
import { SOutlineButton } from '../../styles/buttons';
import IsolatedMenu from './IsolatedMenu';
import { SyCard } from './WorkerProfileStyle';
//from Homefix
import ReviewImg from '../common/ReviewImg';
import {
  ReviewDescription,
  ReviewDiv,
  ReviewHeader,
  ReviewImgDiv,
  ReviewName,
  ReviewsWrapper,
  StarsStyle
} from './WorkerReviewsStyle';
const WorkerReview = ({ reviews, reportReview, like, disLike, loggedUser }) => {
  return (
    <ReviewsWrapper id="wraper">
      {reviews.map((review, index) => {
        return !review.report ? (
          <Container id="reviewCard" key={index}>
            <SyCard>
              <CardContent style={{ display: 'contents' }}>
                <ReviewImgDiv>
                  <ReviewImg
                    defaultImg={!review.isMyNeighbour}
                    userId={review._issuer._id}
                    userType="neighbour"
                  />
                </ReviewImgDiv>
                <ReviewDiv>
                  <ReviewHeader>
                    <ReviewName>
                      {review.isMyNeighbour ? review._issuer.name : 'Anónimo'}
                    </ReviewName>

                    {loggedUser ? (
                      <IsolatedMenu
                        reportReview={() => reportReview(review._id)}
                        _id={review._id}
                      />
                    ) : null}
                  </ReviewHeader>
                  <ReviewDescription>
                    {moment(review.timestamp).format('DD/MM/YYYY')}
                  </ReviewDescription>

                  <ReviewDescription>{review.comment}</ReviewDescription>
                  <StarsStyle>
                    <Rating
                      style={{ position: 'initial' }}
                      name="half-rating-read"
                      precision={0.5}
                      value={review.rating}
                      readOnly
                    />
                  </StarsStyle>
                  <SOutlineButton
                    onClick={() => like(review._id, index)}
                    startIcon={<ThumbUpIcon />}
                  >
                    {review.likes.length}
                  </SOutlineButton>
                  <SOutlineButton
                    startIcon={<ThumbDownIcon />}
                    onClick={() => disLike(review._id, index)}
                  >
                    {review.disLikes.length}
                  </SOutlineButton>
                </ReviewDiv>
              </CardContent>
            </SyCard>
          </Container>
        ) : null;
      })}
    </ReviewsWrapper>
  );
};

export default WorkerReview;
