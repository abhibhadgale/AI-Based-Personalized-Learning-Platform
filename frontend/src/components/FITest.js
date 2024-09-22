import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizQuestions, submitQuizAnswers } from '../redux/slices/quizSlice';
import { getSubjectById } from '../utils/api'; // Import the new API function
import '../styles/FITest.css';

const FITest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questions, result, loading, error } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState([]);
  const [subjectName, setSubjectName] = useState(null); // State to hold the subject name
  const { quizId } = useParams();

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizQuestions(quizId));
    }
  }, [dispatch, quizId]);

  const questionsArray = questions.questions || [];

  const handleAnswerChange = (index, optionIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = optionIndex;
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (quizId) {
      const action = await dispatch(submitQuizAnswers({ quizId, answers }));
      if (action.payload && action.payload.subjectID) {
        const subjectID = action.payload.subjectID;
        try {
          // Fetch the subject name using the subject ID
          const response = await getSubjectById(subjectID);
          const subjectName = response.data.subject; // Adjust based on your API response structure
          setSubjectName(subjectName); // Set the subject name in state
        } catch (error) {
          console.error('Error fetching subject name:', error);
        }
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || 'An error occurred'}</p>;

  return (
    <div className="fitest-container">
      <h2>FITest</h2>
      {questionsArray.length > 0 ? (
        questionsArray.map((question, index) => (
          <div key={question._id} className="question-card">
            <h3>{question.question}</h3>
            <div className="options">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option">
                  <input
                    type="radio"
                    name={question._id}
                    value={optionIndex}
                    checked={answers[index] === optionIndex}
                    onChange={() => handleAnswerChange(index, optionIndex)}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No questions available</p>
      )}
      <button onClick={handleSubmit}>Submit</button>
      {result && (
        <div className="result">
          <h3>Quiz Result</h3>
          <p>Score: {result.score}%</p>
          <p>Correct Answers: {result.correctAnswers} / {result.totalQuestions}</p>
          {/* Button to navigate to the subject page */}
          {subjectName && (
            <button onClick={() => navigate(`/subject/${subjectName}`)}>Go to Subject</button>
          )}
        </div>
      )}
    </div>
  );
};

export default FITest;
