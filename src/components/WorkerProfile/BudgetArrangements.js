//from materialUI
import { CardActions, CardContent, Container } from '@mui/material';
import moment from 'moment';
import React, { Component } from 'react';
//from HomeFix
import { SmallButton } from '../../styles/buttons';
import ReviewImg from '../common/ReviewImg';
import { SyCard } from './WorkerProfileStyle';
import {
  ReviewDescription,
  ReviewDiv,
  ReviewHeader,
  ReviewImgDiv,
  ReviewName
} from './WorkerReviewsStyle';
const types = {
  VIEW_CHAT: 0,
  CANCEL: 1,
  FINALIZE: 2
};
export class BudgetArrangements extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderCard(prop, fields) {
    return (
      <SyCard key={prop._id}>
        <CardContent style={{ display: 'contents' }}>
          <ReviewImgDiv>
            <ReviewImg userId={prop._receiver._id} userType="neighbour" />
          </ReviewImgDiv>
          <ReviewDiv>
            <ReviewHeader>
              <ReviewName>{prop._receiver.name}</ReviewName>
            </ReviewHeader>
            <ReviewDescription>
              Fecha: {moment(prop.createdAt).format('MMMM Do YYYY')}
            </ReviewDescription>

            <ReviewDescription>{prop.title}</ReviewDescription>
            <ReviewDescription>{prop.description}</ReviewDescription>
            <ReviewDescription>
              <strong>Presupuesto</strong> : ${prop.price}
            </ReviewDescription>
          </ReviewDiv>
        </CardContent>
        <CardActions>
          {fields.includes(types.VIEW_CHAT) ? (
            <SmallButton onClick={() => this.props.openConversation(prop)}>
              Ver conversacion
            </SmallButton>
          ) : null}
          {fields.includes(types.CANCEL) ? (
            <SmallButton onClick={() => this.props.deleteProposal(prop._id)}>
              Eliminar
            </SmallButton>
          ) : null}
          {fields.includes(types.FINALIZE) ? (
            <SmallButton onClick={() => this.props.finalizeProposal(prop._id)}>
              Finalizar
            </SmallButton>
          ) : null}
        </CardActions>
      </SyCard>
    );
  }

  renderProposals = () => {
    const {
      waitingProposals,
      acceptedProposals,
      finalizedProposals,
      selectedProposalType
    } = this.props;

    if (selectedProposalType === 'WAIT') {
      return (
        <>
          {waitingProposals.map((prop) =>
            this.renderCard(prop, [types.VIEW_CHAT, types.CANCEL])
          )}
        </>
      );
    } else if (selectedProposalType === 'ACCEPT') {
      return (
        <>
          {acceptedProposals.map((prop) =>
            this.renderCard(prop, [types.FINALIZE, types.VIEW_CHAT])
          )}
        </>
      );
    } else {
      return (
        <>
          {finalizedProposals.map((prop) =>
            this.renderCard(prop, [types.VIEW_CHAT])
          )}
        </>
      );
    }
  };

  render() {
    return (
      <Container style={{ padding: '20px' }}>
        {this.renderProposals()}
      </Container>
    );
  }
}

export default BudgetArrangements;
