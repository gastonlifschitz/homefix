import http from './httpService';

//employees
export function createUser(path, data) {
  return http.post(`/api/${path}`, data);
}

export function getEmployee(id) {
  return http.get(`/api/employees/${id}`);
}

export function getAllEmployees() {
  return http.get(`/api/employees`);
}

export function getEmployeeProfilePic(id) {
  return http.get(`/api/employees/profilePic/${id}`);
}

export function getProfilePic(id) {
  return http.get(`/api/users/profilePic/${id}`);
}

export function getEmployeeByRubro(rubroName) {
  return http.get(`/api/employees/byRubro/${rubroName}`);
}

export function getEmployeeInfo(id) {
  return http.get(`/api/employees/${id}`);
}

export function deleteEmplotee(id) {
  return http.delete(`api/employees/${id}`);
}
export function updateEmployee(id, data) {
  return http.put(`api/employees/${id}`, data);
}
export function reportEmployee(id, report) {
  return http.patch(`/api/employees/${id}`, { blackList: report });
}

export function getAllEmployeesOrdered(parameters) {
  const params = new URLSearchParams(parameters);

  return http.get(`/api/employees/all/search?${params.toString()}`);
}

//reviews
export function getReviews(id) {
  return http.get(`/api/reviews/${id}`);
}

export function getAllMyReviews(id) {
  return http.get(`/api/reviews/issuedBy/${id}`);
}

export function getAverageRating(id) {
  return http.get(`/api/reviews/rating/${id}`);
}

export function saveReview(proposalId, payload) {
  return http.post(`/api/reviews/proposal/${proposalId}`, payload);
}

export function reportReview(id) {
  return http.patch(`/api/reviews/report/${id}`);
}

export function unreportReview(id) {
  return http.patch(`/api/reviews/unreport/${id}`);
}

export function getAllReviews() {
  return http.get(`/api/reviews/`);
}
export function getReportedReviews() {
  return http.get(`/api/reviews/report`);
}

export function deleteReview(id) {
  return http.delete(`api/reviews/${id}`);
}

export function likeReview(id) {
  return http.patch(`api/reviews/like/${id}`);
}

export function disLikeReview(id) {
  return http.patch(`api/reviews/dislike/${id}`);
}

export function forgotPassword(payload) {
  return http.post(`api/auth/forgot-password`, payload);
}

export function resetPassword(payload) {
  return http.post(`api/auth/reset-password`, payload);
}

export function activateAccount(payload) {
  return http.post(`api/auth/email-activate`, payload);
}

export function uploadUserGallery(id, payload) {
  return http.post(`api/employees/upload-gallery/${id}`, payload);
}

export function getGalleryImages(employeeId) {
  return http.get(`api/employees/gallery/${employeeId}`);
}

export function getNeighborhood(groupCode) {
  return http.get(`api/neighborhoods/?name=${groupCode}`);
}

export function getNeighbour(id) {
  return http.get(`api/neighbours/${id}`);
}

export function getAllNeighours() {
  return http.get(`api/neighbours`);
}

export function getAdmin(id) {
  return http.get(`api/admin/${id}`);
}

export function getUser(id) {
  return http.get(`api/users/${id}`);
}

export function deleteNeighbour(neighborhood, neigbhourId) {
  return http.delete(
    `api/neighborhoods/${neighborhood}/neighbour/${neigbhourId}`
  );
}

export function sendMessage(payload) {
  return http.post(`api/messages/send-message`, payload);
}

export function addUserToNeighborhood(payload) {
  return http.post(`api/neighborhoods/add-user`, payload);
}

export function addAdminToNeighborhood(payload) {
  return http.put(`api/neighborhoods/add-admin`, payload);
}

export function createNeighborhood(payload) {
  return http.post(`api/neighborhoods`, payload);
}

export function deleteMessage(messageId, neighborhood) {
  return http.delete(`api/messages/${messageId}/neighborhood/${neighborhood}`);
}

export function updateUser(payload, path, id) {
  return http.put(`api/${path}/${id}`, payload);
}

export function leaveNeighborhoodAsAdmin(neighborhood, adminId) {
  return http.delete(`api/neighborhoods/${neighborhood}/admin/${adminId}`);
}

export function getChats(_provider, _receiver) {
  return http.get(`api/chats/getChats/${_provider}/${_receiver}`);
}

export function getProposal(neighbourId, employeeId) {
  return http.get(`api/proposals/${neighbourId}/${employeeId}`);
}

export function sendChatMessage(_provider, _receiver, content) {
  return http.post(`api/chats`, { _provider, _receiver, content });
}

export function getEmployeeConversations(employee) {
  return http.get(`api/chatInfo/employee/${employee}`);
}

export function getNeighbourConversations(employee) {
  return http.get(`api/chatInfo/neighbour/${employee}`);
}

export function createProposal(payload) {
  return http.post(`api/proposals`, payload);
}

export function getNeighbourProposals(employeeId) {
  return http.get(`api/neighbours/proposals/${employeeId}`);
}

export function getEmployeeProposals(employeeId) {
  return http.get(`api/employees/proposals/${employeeId}`);
}

export function acceptProposal(proposal) {
  return http.patch(`api/proposals/${proposal}/accept`);
}

export function finalizeProposal(proposal) {
  return http.patch(`api/proposals/${proposal}/finalize`);
}

export function cancelProposal(proposal) {
  return http.delete(`api/proposals/${proposal}`);
}

export function updateProfilePic(userId, payload) {
  return http.put(`api/userGallery/profilePic/${userId}`, payload);
}

export function updateLastSeen() {
  return http.post(`api/updateLastSeen`);
}
