import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Use your backend base URL
});

// Attach token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getStudentData = () => API.get('/analytics/progress');
export const getQuizQuestions = (quizId) => API.get(`/quiz/${quizId}`);
export const submitQuizResponse = (quizId, answers) => API.post(`/quiz/submit/${quizId}`, { answers });
export const getLearningPath = () => API.get('/analytics/learning-path');
