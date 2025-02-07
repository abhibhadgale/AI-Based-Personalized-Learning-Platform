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

  // Function to calculate the number of completed subtopics for each topic
  const getCompletedSubtopicsCount = (subtopics) => {
    return subtopics.filter(subtopic => checkedSubtopics[subtopic.subtopicId]).length;
  };

  return (
    <div className="learning-sidebar">
      <h2>Content:</h2>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li
              key={topic.topicId}
              className={`topic-item ${expandedTopic === topic.topicId ? 'active' : ''}`}
              onClick={() => toggleTopic(topic.topicId)}
            >
              <div className="topic-header">
                <span>{topic.topicName}</span>
              </div>

              {/* Display the count below the topic header */}
              {topic.subtopics && topic.subtopics.length > 0 && (
                <div className="subtopics-count">
                  {getCompletedSubtopicsCount(topic.subtopics)} / {topic.subtopics.length}
                </div>
              )}

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
