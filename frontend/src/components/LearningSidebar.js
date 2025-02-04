import React, { useState } from 'react';
import '../styles/LearningSidebar.css';
import { useNavigate } from 'react-router-dom';

const LearningSidebar = ({ topics, onTopicClick, unitMcqTest, subjectId }) => {
  const navigate = useNavigate();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [checkedSubtopics, setCheckedSubtopics] = useState({});

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const handleCheckboxChange = (subtopicId) => {
    setCheckedSubtopics((prev) => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  };

  return (
    <div className="learning-sidebar">
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li key={topic.topicId} className={`topic-item ${expandedTopic === topic.topicId ? 'active' : ''}`} onClick={() => toggleTopic(topic.topicId)}>
              {topic.topicName}
              {topic.subtopics && topic.subtopics.length > 0 && (
                <ul className="subtopics">
                  {topic.subtopics.map((subtopic) => (
                    <li key={subtopic.subtopicId} className="subtopic-item">
                      <input
                        type="checkbox"
                        className="subtopic-checkbox"
                        checked={checkedSubtopics[subtopic.subtopicId] || false}
                        onChange={() => handleCheckboxChange(subtopic.subtopicId)}
                      />
                      {subtopic.subtopicName}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        ) : (
          <li>No topics available</li>
        )}
      </ul>

      {unitMcqTest && (
        <button className="take-test-btn" onClick={() => navigate(`/test/${unitMcqTest}`, { state: { subjectId } })}>
          Finish and Take a Test
        </button>
      )}
    </div>
  );
};

export default LearningSidebar;
