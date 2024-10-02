import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizQuestions, submitQuizAnswers } from '../redux/slices/quizSlice';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/Test.css';

const Test = () => {
  const { unitMcqTest } = useParams();
  const location = useLocation(); // Use useLocation to access state
  const subjectId = location.state?.subjectId; // Access subjectId from location state
  const dispatch = useDispatch();
  const { questions, result, loading, error } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (unitMcqTest) {
      dispatch(fetchQuizQuestions(unitMcqTest));
    }
  }, [dispatch, unitMcqTest]);

  useEffect(() => {
    if (questions) {
      setTitle(questions.title); // Set the quiz title once questions data is fetched
    }
  }, [questions]);

  const handleAnswerChange = (index, optionIndex) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = optionIndex;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    if (unitMcqTest) {
      dispatch(submitQuizAnswers({ quizId: unitMcqTest, answers, subjectId }));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || 'An error occurred'}</p>;

  return (
    <div className="test-container">
      {title && <h1 className="quiz-title">{title}</h1>} {/* Display the quiz title */}
      {questions && questions.questions && questions.questions.length > 0 ? (
        questions.questions.map((question, index) => (
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
      <button onClick={handleSubmit}>Submit Test</button>
      {result && (
        <div className="result">
          <h3>Test Result</h3>
          <p>Score: {result.score}%</p>
          <p>Correct Answers: {result.correctAnswers} / {result.totalQuestions}</p>
        </div>
      )}
    </div>
  );
};

export default Test;
