import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllSubjects = () => API.get('/subjects');
export const subjectfundamental = (subject) => API.get(`/subjectfundamental?subject=${subject}`);
export const getStudentData = () => API.get('/analytics/progress');
export const getLearningPath = () => API.get('/analytics/learning-path');
export const getQuizList = () => API.get('/quizzes');
export const getQuizQuestions = (quizId) => API.get(`/quizzes/${quizId}`);
export const submitQuizResponse = (quizId, answers, subjectId) => API.post(`/quizzes/submit/${quizId}`, { answers, subjectId });
export const getStudentQuizResults = () => API.get('/quizzes/results');
export const getFITestCompletionStatus = (subjectId) => API.get(`/quizzes/fitest/completion-status/${subjectId}`);
export const getSubjectById = (subjectID) => API.get(`/subjects/${subjectID}`);
export const getSubjectUnits = (subjectID) => API.get(`/subjects/units/${subjectID}`);
export const fetchUnitTopics = (unitId) => {
  return API.get(`/units/${unitId}/topics`); // Adjusted to match your backend route
};
// Fetch a note by noteId
export const fetchNoteById = (noteId) => {
  return API.get(`/notes/${noteId}`);
};

export const fetchVideoById = (videoId) => {
  return API.get(`/videos/${videoId}`);
};

// Fetch a resource by resourceId
export const fetchResourceById = (resourceId) => {
  return API.get(`/resources/${resourceId}`);
};

export const fetchDiagramById = (diagramId) => {
  return API.get(`/diagrams/${diagramId}`);
};

//update user profile
export const submitUserProfile = (profileData) => {
  return API.post('/users/profile', profileData);
};

// Get user profile
export const fetchUserProfile = () => {
  return API.get('/users/profile'); // Ensure this matches your backend route
};

export const updateUserProfileCompleted = (userId) => {
  return API.patch(`/users/profile-completion`);
};

// Cart-related APIs
export const addToCart = (subjectId) =>
  API.post('/cart/add', {subjectId });
export const fetchCartItems = () => API.get(`/cart`);
export const removeFromCart = (subjectId) =>
  API.delete(`/cart/remove`, { subjectId });

export const addSemesterPackageToCart = (subjectIds) =>
  API.post('/cart/add-multiple', { subjectIds });

// New API for checkout
export const checkoutCart = (subjectIds) => {
  return API.post('/cart/checkout', { subjectIds });
};

export const checkEnrollmentStatus = (subjectId) =>
  API.get(`/enrollment/check/${subjectId}`);

export const fetchSubtopicById = (subtopicId) => API.get(`/subtopics/${subtopicId}`);

export const saveStudentProgress = async (progressData) => {
  console.log('Progress data being sent:', progressData);
  return API.post(`/progress`, {
    unitId: progressData.unitId,
    subtopicsId: progressData.subtopicsId, 
    startTime: progressData.startTime,
    endTime: progressData.endTime
  });
};

export const getStudentProgress = async () => {
  return API.get('/progress');
};

export const getSubtopicCount = (unitId) => API.get(`/units/${unitId}/subtopic-count`);
export const getCompletedTopicCount = () => API.get('/progress/completed-count');