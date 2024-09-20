import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizList, fetchQuizQuestions, submitQuizAnswers } from '../redux/slices/quizSlice';
import '../styles/Quiz.css';

const Quiz = ({ quizId }) => {
  const dispatch = useDispatch();
  const { quizList, questions, result, loading, error } = useSelector((state) => state.quiz);
  const [selectedQuizId, setSelectedQuizId] = useState(quizId || null);
  const [answers, setAnswers] = useState([]); // Initialize as an empty array

  // Fetch the list of quizzes on component load
  useEffect(() => {
    dispatch(fetchQuizList());
  }, [dispatch]);

  // Fetch the questions when a quiz is selected
  useEffect(() => {
    if (selectedQuizId) {
      dispatch(fetchQuizQuestions(selectedQuizId));
    }
  }, [dispatch, selectedQuizId]);

  // Extract the questions array from the structure
  const questionsArray = questions.questions || [];

  // Handle answer selection
  const handleAnswerChange = (index, optionIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers]; // Create a new array for answers
      newAnswers[index] = optionIndex; // Set the answer based on index
      return newAnswers; // Return the new array
    });
  };

  // Submit the quiz
  const handleSubmit = () => {
    if (selectedQuizId) {
      dispatch(submitQuizAnswers({ quizId: selectedQuizId, answers })); // Send the answers array
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || 'An error occurred'}</p>;

  return (
    <div className="quiz-container">
      {!selectedQuizId ? (
        <div>
          <h2>Available Quizzes</h2>
          {quizList.length > 0 ? (
            <ul className="quiz-list">
              {quizList.map((quiz) => (
                <li key={quiz._id} onClick={() => setSelectedQuizId(quiz._id)}>
                  {quiz.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No quizzes available</p>
          )}
        </div>
      ) : (
        <div>
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
                        checked={answers[index] === optionIndex}  // Compare with option index
                        onChange={() => handleAnswerChange(index, optionIndex)}  // Pass index
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
