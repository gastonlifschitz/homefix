import React from 'react';
import { baseURL, CLIENT_URL } from '../../env.json';
import { ReviewIcon } from '../WorkerProfile/WorkerReviewsStyle';

export default function ReviewImg({ userId, userType, defaultImg }) {
  const profilePic = baseURL + '/api/' + userType + 's/profilePic/' + userId;

  return (
    <ReviewIcon
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = CLIENT_URL + '/img/unknown.png';
      }}
      src={defaultImg ? CLIENT_URL + '/img/unknown.png' : profilePic}
    />
  );
}
