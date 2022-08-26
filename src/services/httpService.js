import axios from 'axios';
import { baseURL } from '../env.json';

const { PUBLIC_URL } = process.env;

axios.defaults.baseURL = baseURL; // If deployed change this to baseURL-Prod

if (PUBLIC_URL) axios.defaults.baseURL = PUBLIC_URL;

console.log('baseURL', axios.defaults.baseURL);

axios.defaults.headers.common['Cache-Control'] = 'no-cache';

/*axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("unexpected: ", error);
    // const { data } = error.response;
    // const msg = { data } ? data : error.response;
    // toast.error(`⚠️ ${msg}`);
    return Promise.reject(error);
  }
  console.log(error.response);
  toast.error(`⚠️ ${error.response.data}`);
  return error.response;
});*/

function setJwt(jwt) {
  if (jwt) axios.defaults.headers.common['pf-token'] = jwt;
}

const exportedObject = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
  setJwt
};

export default exportedObject;
