import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizQuestions, submitQuizAnswers } from '../redux/slices/quizSlice';

const Quiz = ({ quizId }) => {
  const dispatch = useDispatch();
  const { questions, result, loading, error } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizQuestions(quizId));
    }
  }, [dispatch, quizId]);

  const handleSubmit = () => {
    if (quizId) {
      dispatch(submitQuizAnswers({ quizId, answers }));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <h3>{question.text}</h3>
          {/* Render question options and handle answer change */}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {result && <div>Result: {JSON.stringify(result)}</div>}
    </div>
  );
};

export default Quiz;
