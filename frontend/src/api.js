import axios from 'axios';

const instance = axios.create({
 baseURL: `http://localhost:4000/`,
 //baseURL: `http://140.112.94.126:4000/`,
 //給實驗室電腦的docker tool用
});

export default instance;
