// LearningSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LearningSidebar.css';

const LearningSidebar = ({ topics }) => {
  return (
    <div className="learning-sidebar">
      <h3>Topics</h3>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li key={topic.topicId}>
              <Link to={`/learning/topic/${topic.topicId}`}>{topic.topicName}</Link>
            </li>
          ))
        ) : (
          <li>No topics available</li>
        )}
      </ul>
    </div>
  );
};

export default LearningSidebar;
