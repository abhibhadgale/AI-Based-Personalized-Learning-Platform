import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizList, fetchQuizQuestions, submitQuizAnswers } from '../redux/slices/quizSlice';
import '../styles/Quiz.css';

const Quiz = ({ quizId, subjectId }) => {
  const dispatch = useDispatch();
  const { quizList, questions, result, loading, error } = useSelector((state) => state.quiz);
  const [selectedQuizId, setSelectedQuizId] = useState(quizId || null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchQuizList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedQuizId) {
      dispatch(fetchQuizQuestions(selectedQuizId));
    }
  }, [dispatch, selectedQuizId]);

  const questionsArray = questions.questions || [];
  const totalQuestions = questionsArray.length;

  const handleAnswerChange = (optionIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    setAnswers((prevAnswers) => [...prevAnswers, null]);
    handleNext();
  };

  const handleSubmit = () => {
    if (selectedQuizId) {
      dispatch(submitQuizAnswers({ quizId: selectedQuizId, answers, subjectId }));
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
          {totalQuestions > 0 ? (
            <div className="question-card">
              <h3>{questionsArray[currentQuestionIndex].question}</h3>
              <p className="question-count">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
              <div className="options">
                {questionsArray[currentQuestionIndex].options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`option ${answers[currentQuestionIndex] === optionIndex ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange(optionIndex)}
                  >
                    <label>{option}</label>
                  </div>
                ))}
              </div>
              <div className="navigation-buttons">
                <button onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</button>
                <button onClick={handleSkip}>Skip</button>
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button onClick={handleNext}>Next</button>
                ) : (
                  <button onClick={handleSubmit}>Submit</button>
                )}
              </div>
            </div>
          ) : (
            <p>No questions available</p>
          )}
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
