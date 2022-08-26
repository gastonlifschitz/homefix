import React from 'react';
import { CLIENT_URL } from '../../env.json';
import {
  ServiceCard,
  ServiceCardTitle,
  ServiceDescription,
  StartsStyle
} from '../ListWorkers/ListWorkersStyle';

export default function SearchWorkers({ employees, sortByRating }) {
  const renderEmployeeCard = (employee, i) => {
    return (
      <ServiceCard to={`/profile/${employee._id}`} key={i}>
        <div
          style={{
            width: '160px',
            height: '160px',
            display: 'flex',
            alignItems: ' center',
            justifyContent: 'center'
          }}
        >
          <img
            key={i}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = CLIENT_URL + '/img/unknown.png';
            }}
            alt={employee._id}
            src={employee.profilePic}
            style={{
              height: 'auto',
              width: 'auto',
              maxWidth: '160px',
              maxHeight: '160px',
              borderRadius: ' 30px'
            }}
          />
        </div>

        <ServiceCardTitle>
          {employee.name} {employee.lastName}
        </ServiceCardTitle>
        <ServiceDescription>{employee.description} </ServiceDescription>

        <StartsStyle
          name={'read-only' + i}
          value={employee.rating}
          readOnly
          precision={0.5}
        />
      </ServiceCard>
    );
  };

  return employees
    ? employees.map((employee, i) => renderEmployeeCard(employee, i))
    : null;
}
