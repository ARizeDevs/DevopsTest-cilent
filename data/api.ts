import axios from 'axios';
import detect from '@/utils/detect';

const api = axios.create({
  baseURL: detect.isNodeJS ? process.env.apiEndpoint : `/api`,
});

export default api;