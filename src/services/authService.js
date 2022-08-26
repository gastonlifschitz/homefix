import jwtDecode from 'jwt-decode';
import { tokenKey } from '../config.json';
import http from './httpService';

const apiEndpoint = '/api/auth';
const superAdminApiEndpoint = '/api/superAdmin';

//adding token, if any, to the headers.
//Required to access protected api endpoints.

http.setJwt(getJwt());

export async function loginUser(email, password) {
  const { data: jwt } = await http.post(apiEndpoint + '/login', {
    email: email,
    password
  });

  const { token } = jwt;
  localStorage.setItem(tokenKey, token);
  http.setJwt(getJwt());
  return jwtDecode(token);
}

export async function loginSuperAdmin(email, password) {
  const { data: jwt } = await http.post(superAdminApiEndpoint + '/login', {
    email: email,
    password
  });

  const { token } = jwt;
  localStorage.setItem(tokenKey, token);
  http.setJwt(getJwt());
  return jwtDecode(token);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

const exportedObject = {
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt,
  loginUser
};

export default exportedObject;
