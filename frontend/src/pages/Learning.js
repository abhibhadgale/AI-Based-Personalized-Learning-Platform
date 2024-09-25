// Learning.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUnitTopicsThunk } from '../redux/slices/unitsSlice';
import '../styles/Learning.css';

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, loading, error, unitName } = useSelector((state) => state.units); // Added unitName to state

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId)); // Fetch topics using the new action
  }, [dispatch, unitId]);

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>Error loading topics: {error}</p>;

  return (
    <div className="learning-container">
      <h2>Topics for {unitName}</h2> {/* Display unit name */}
      <ul className="topics-list">
        {topics.map((topic) => (
          <li key={topic.topicId} className="topic-item">
            {topic.topicName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPage;
