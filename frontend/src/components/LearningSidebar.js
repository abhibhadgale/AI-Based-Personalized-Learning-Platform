import React from 'react';
import '../styles/LearningSidebar.css';
import { useNavigate } from 'react-router-dom';

const LearningSidebar = ({ topics, onTopicClick, unitMcqTest, subjectId }) => { // Accept subjectId as a prop
  const navigate = useNavigate();


  const handleTakeTest = () => {
    navigate(`/test/${unitMcqTest}`, { state: { subjectId } }); // Pass subjectId as part of location state
  };

  return (
    <div className="learning-sidebar">
      <h3>Topics</h3>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <li
              key={topic.topicId}
              className="topic-item"
              onClick={() =>
                onTopicClick(
                  topic.topicNoteId,
                  topic.topicVideoId,
                  topic.topicResourcesId,
                  topic.topicQuizId,
                  topic.topicDiagramId
                )
              }
            >
              {topic.topicName}
            </li>
          ))
        ) : (
          <li>No topics available</li>
        )}
      </ul>

      {unitMcqTest && (
        <button className="take-test-btn" onClick={handleTakeTest}>
          Finish and Take a Test
        </button>
      )}
    </div>
  );
};

export default LearningSidebar;
