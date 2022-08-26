import { isWidthUp } from '@material-ui/core/withWidth';
import {
  Button,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  TextField
} from '@mui/material';
import React, { useState } from 'react';
import { useToggleNavBar } from '../../services/util';
import { SButton } from '../../styles/buttons';
import { SPaper } from '../../styles/styles';
import ChatPage from '../ChatPage';
import ReviewCard from '../common/ReviewCard';
import ReviewImg from '../common/ReviewImg';
import { SyCard } from '../WorkerProfile/WorkerProfileStyle';
import {
  ReviewDescription,
  ReviewDiv,
  ReviewHeader,
  ReviewImgDiv,
  ReviewName
} from '../WorkerProfile/WorkerReviewsStyle';

export default function ProposalCard({
  proposal,
  neighbour,
  acceptProposal,
  cancelProposal,
  finalizeProposal,
  submitReview,
  reviewChange,
  reviewPayload,
  reviewValueChange,
  clearReview,
  setReviewEmployee,
  setReviewProposal,
  width
}) {
  const [openChat, setOpenChat] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [review, setReview] = useState(null);
  const { isOpen, toggle } = useToggleNavBar(false);

  return (
    <div>
      <Container style={{ padding: '20px' }}>
        <SyCard>
          <CardContent style={{ display: 'contents' }}>
            <ReviewImgDiv>
              <ReviewImg userId={proposal._provider._id} userType="employee" />
            </ReviewImgDiv>
            <ReviewDiv>
              <ReviewHeader>
                <ReviewName>{proposal._provider.name}</ReviewName>
              </ReviewHeader>

              <ReviewDescription>{proposal.title} </ReviewDescription>
              <ReviewDescription>{proposal.description}</ReviewDescription>
            </ReviewDiv>
            <SPaper elevation={2}>${proposal.price}</SPaper>
          </CardContent>
          <CardActions
            id="proposalCardActions"
            style={{ flexDirection: isWidthUp('sm', width) ? 'row' : 'column' }}
          >
            {proposal.state === 'WAIT' ? (
              <>
                <SButton onClick={acceptProposal}>Aceptar</SButton>
                <SButton onClick={cancelProposal}>Rechazar</SButton>
              </>
            ) : proposal.state === 'ACCEPT' ? (
              <SButton onClick={finalizeProposal}>Finalizar</SButton>
            ) : proposal._review ? (
              <SButton
                onClick={() => {
                  setReview(proposal._review);
                  setOpenReview(true);
                }}
              >
                Ver reseña
              </SButton>
            ) : (
              <SButton
                onClick={() => {
                  toggle();
                  setReviewEmployee();
                  setReviewProposal();
                }}
              >
                Escribir reseña
              </SButton>
            )}
            <SButton onClick={() => setOpenChat(true)}>Ver Chat</SButton>
          </CardActions>
        </SyCard>
      </Container>
      <Dialog
        open={openReview && review}
        style={{ zIndex: '5000' }}
        onClose={() => {
          setOpenReview(false);
          setReview(null);
        }}
        id="review"
      >
        <ReviewCard review={review} />
      </Dialog>
      <Dialog
        open={isOpen}
        onClose={() => {
          toggle();
          clearReview();
        }}
        id="review"
      >
        <DialogTitle>Reseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Comparta su experiencia con el trabajador
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Reseña"
            value={reviewPayload.text}
            type="text"
            fullWidth
            variant="standard"
            onChange={reviewChange}
            multiline
            rows={2}
          />
          <Rating
            name="ratingStars"
            defaultValue={0}
            precision={0.5}
            value={reviewPayload.value}
            size="small"
            onChange={reviewValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              submitReview();
              toggle();
            }}
          >
            {' '}
            Guardar
          </Button>
          <Button
            onClick={() => {
              clearReview();
              toggle();
            }}
          >
            {' '}
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {openChat ? (
        <ChatPage
          employee={proposal._provider}
          neighbour={neighbour}
          openDialog={openChat}
          handleCloseDialog={() => setOpenChat(false)}
          amIEmployee={false}
        />
      ) : null}
    </div>
  );
}
