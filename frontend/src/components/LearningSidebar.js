import React from 'react';
import '../styles/LearningSidebar.css';

const LearningSidebar = ({ topics, onTopicClick }) => {
  return (
    <div className="learning-sidebar">
      <h3>Topics</h3>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li key={topic.topicId}>
              <button
                onClick={() => onTopicClick(topic.topicNoteId, topic.topicVideoId, topic.topicResourcesId)}
              >
                {topic.topicName}
              </button>
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
