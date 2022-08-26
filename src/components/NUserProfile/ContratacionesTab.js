import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { Component } from 'react';
import { TabPanel } from '../../services/util';
import { H2Heading } from '../../styles/headings';
import ProposalCard from '../common/ProposalCard';

export class ContratacionesTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0
    };
  }
  handleTabChange = async (_, value) => {
    this.setState({ tabValue: value });
    await this.props.getProposals();
  };

  render() {
    const { tabValue } = this.state;
    const { width } = this.props;

    const {
      acceptProposal,
      cancelProposal,
      finalizeProposal,
      submitReview,
      reviewChange,
      reviewPayload,
      reviewValueChange,
      clearReview,
      setReviewEmployee,
      setReviewProposal
    } = this.props;
    return (
      <div>
        <>
          {this.props.myProposals &&
          this.props.myProposals.waitingProposals.length === 0 &&
          this.props.myProposals.acceptedProposals.length === 0 &&
          this.props.myProposals.finalizedProposals.length === 0 ? (
            <H2Heading>No tiene contrataciones </H2Heading>
          ) : (
            <>
              <H2Heading>Contrataciones </H2Heading>
              <Tabs
                value={tabValue}
                onChange={this.handleTabChange}
                aria-label="basic tabs example"
                variant="fullWidth"
                orientation={isWidthUp('sm', width) ? 'horizontal' : 'vertical'}
              >
                <Tab label="En espera" />
                <Tab label="Aceptadas" />
                <Tab label="Finalizadas" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                {this.props.myProposals &&
                  this.props.myProposals.waitingProposals.map(
                    (proposal, index) => (
                      <ProposalCard
                        key={index}
                        acceptProposal={() => acceptProposal(proposal._id)}
                        cancelProposal={() => cancelProposal(proposal._id)}
                        finalizeProposal={() => finalizeProposal(proposal._id)}
                        setReviewProposal={() =>
                          setReviewProposal(proposal._id)
                        }
                        setReviewEmployee={() =>
                          setReviewEmployee(proposal._provider._id)
                        }
                        proposal={proposal}
                        neighbour={this.props.neighbour}
                        submitReview={submitReview}
                        reviewChange={reviewChange}
                        reviewPayload={reviewPayload}
                        reviewValueChange={reviewValueChange}
                        clearReview={clearReview}
                        width={width}
                      />
                    )
                  )}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {this.props.myProposals &&
                  this.props.myProposals.acceptedProposals.map(
                    (proposal, index) => (
                      <ProposalCard
                        key={index}
                        acceptProposal={() => acceptProposal(proposal._id)}
                        cancelProposal={() => cancelProposal(proposal._id)}
                        finalizeProposal={() => finalizeProposal(proposal._id)}
                        setReviewProposal={() =>
                          setReviewProposal(proposal._id)
                        }
                        setReviewEmployee={() =>
                          setReviewEmployee(proposal._provider._id)
                        }
                        proposal={proposal}
                        neighbour={this.props.neighbour}
                        submitReview={submitReview}
                        reviewChange={reviewChange}
                        reviewPayload={reviewPayload}
                        reviewValueChange={reviewValueChange}
                        clearReview={clearReview}
                        width={width}
                      />
                    )
                  )}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {this.props.myProposals &&
                  this.props.myProposals.finalizedProposals.map(
                    (proposal, index) => (
                      <ProposalCard
                        key={index}
                        acceptProposal={() => acceptProposal(proposal._id)}
                        cancelProposal={() => cancelProposal(proposal._id)}
                        finalizeProposal={() => finalizeProposal(proposal._id)}
                        setReviewProposal={() =>
                          setReviewProposal(proposal._id)
                        }
                        setReviewEmployee={() =>
                          setReviewEmployee(proposal._provider._id)
                        }
                        proposal={proposal}
                        neighbour={this.props.neighbour}
                        submitReview={submitReview}
                        reviewChange={reviewChange}
                        reviewPayload={reviewPayload}
                        reviewValueChange={reviewValueChange}
                        clearReview={clearReview}
                        width={width}
                      />
                    )
                  )}
              </TabPanel>
            </>
          )}
        </>
      </div>
    );
  }
}

export default withWidth()(ContratacionesTab);
