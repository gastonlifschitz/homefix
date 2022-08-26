import { cancelProposal, finalizeProposal } from './apiService';

class Proposals {
  async finalizeProposal(proposalId) {
    const { status, sendError } = await finalizeProposal(proposalId).catch(
      (error) => {
        return { sendError: true };
      }
    );

    if (sendError)
      return {
        success: false,
        severitySnackBar: 'error',
        messageSnackBar: 'Error en la finalizacion'
      };

    return {
      severitySnackBar: 'success',
      messageSnackBar: 'Finalizacion Exitosa',
      success: status === 200
    };
  }

  cancelProposal = async (proposalId) => {
    const { status, sendError } = await cancelProposal(proposalId).catch(
      (error) => {
        return { sendError: true };
      }
    );

    if (sendError)
      return {
        success: false,
        severitySnackBar: 'error',
        messageSnackBar: 'Error en la cancelacion'
      };

    return {
      severitySnackBar: 'success',
      messageSnackBar: 'Se ha rechazado el presupuesto',
      success: status === 200
    };
  };
}

export default new Proposals();
