import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Use your backend base URL
});

// Attach token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllSubjects = () => API.get('/subjects');
export const getStudentData = () => API.get('/analytics/progress');
export const getLearningPath = () => API.get('/analytics/learning-path');
export const getQuizList = () => API.get('/quizzes');
export const getQuizQuestions = (quizId) => API.get(`/quizzes/${quizId}`);
export const submitQuizResponse = (quizId, answers, subjectId) => API.post(`/quizzes/submit/${quizId}`, { answers, subjectId }); // Include subjectId
export const getStudentQuizResults = () => API.get('/quizzes/results');
export const getFITestCompletionStatus = (subjectId) => API.get(`/quizzes/fitest/completion-status/${subjectId}`);

export const getSubjectById = (subjectID) => API.get(`/subjects/${subjectID}`); // Adjust the endpoint based on your backend structure

