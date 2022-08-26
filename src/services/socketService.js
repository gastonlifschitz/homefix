import { io } from 'socket.io-client';
import { baseURL } from '../../env.json';

const URL = baseURL;
const socket = io(URL, { autoConnect: false });

export default socket;
