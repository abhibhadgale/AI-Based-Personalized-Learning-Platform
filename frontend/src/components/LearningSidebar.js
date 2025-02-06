import React, { useState } from 'react';
import '../styles/LearningSidebar.css';
import { useNavigate } from 'react-router-dom';

const LearningSidebar = ({ topics, onSubtopicClick, unitMcqTest, subjectId }) => {
  const navigate = useNavigate();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [checkedSubtopics, setCheckedSubtopics] = useState({});

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const handleCheckboxChange = (e, subtopicId) => {
    e.stopPropagation(); // Prevents topic toggle when clicking the checkbox
    setCheckedSubtopics((prev) => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  };

  const handleSubtopicClick = (e, subtopicId) => {
    e.stopPropagation(); // Prevents topic toggle when clicking on subtopic
    onSubtopicClick(subtopicId);
  };

  return (
    <div className="learning-sidebar">
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li
              key={topic.topicId}
              className={`topic-item ${expandedTopic === topic.topicId ? 'active' : ''}`}
              onClick={() => toggleTopic(topic.topicId)}
            >
              <span className="topic-name">{topic.topicName}</span>

              {topic.subtopics && topic.subtopics.length > 0 && (
                <ul className={`subtopics ${expandedTopic === topic.topicId ? 'expanded' : ''}`}>
                  {topic.subtopics.map((subtopic) => (
                    <li
                      key={subtopic.subtopicId}
                      className="subtopic-item"
                      onClick={(e) => handleSubtopicClick(e, subtopic.subtopicId)}
                    >
                      <input
                        type="checkbox"
                        className="subtopic-checkbox"
                        checked={checkedSubtopics[subtopic.subtopicId] || false}
                        onChange={(e) => handleCheckboxChange(e, subtopic.subtopicId)}
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
        <button
          className="take-test-btn"
          onClick={() => navigate(`/test/${unitMcqTest}`, { state: { subjectId } })}
        >
          Finish and Take a Test
        </button>
      )}
    </div>
  );
};

export default LearningSidebar;
