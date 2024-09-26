import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';

import { fetchUnitTopicsThunk } from '../redux/slices/unitsSlice';
import LearningSidebar from '../components/LearningSidebar';
import '../styles/Learning.css';
import { fetchNoteById, fetchVideoById, fetchResourceById } from '../utils/api'; // Import API call for fetching resource

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, loading, error, unitName } = useSelector((state) => state.units);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null); // State to store the selected video link
  const [selectedResource, setSelectedResource] = useState(null); // State to store the selected resource link
  const [activeTab, setActiveTab] = useState('video'); // State to manage the selected tab

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId));
  }, [dispatch, unitId]);

  // Function to handle topic click and fetch the corresponding note, video, and resource
  const handleTopicClick = async (topicNoteId, topicVideoId, topicResourcesId) => {
    try {
      const noteResponse = await fetchNoteById(topicNoteId);
      setSelectedNote(noteResponse.data.note);
      setSelectedTopic(noteResponse.data.topicName);

      const videoResponse = await fetchVideoById(topicVideoId);
      setSelectedVideo(videoResponse.data.link); // Update state with fetched video link

      const resourceResponse = await fetchResourceById(topicResourcesId);
      setSelectedResource(resourceResponse.data.resource); // Update state with fetched resource link
    } catch (error) {
      console.error('Error fetching note, video, or resource:', error);
    }
  };

  // Function to render tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'video':
        return selectedVideo ? (
          <div className="video-content" dangerouslySetInnerHTML={{ __html: selectedVideo }} />
        ) : (
          <p>Select a topic to view its video.</p>
        );
      case 'quiz':
        return <p>This is the quiz content.</p>;
      case 'resource':
        return selectedResource ? (
          <a href={selectedResource} target="_blank" rel="noopener noreferrer" className="resource-link-button">
            <LinkIcon />View Resource
          </a>
        ) : (
          <p>Select a topic to view its resource.</p>
        );
      default:
        return null;
    }
  };

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>Error loading topics: {error}</p>;

  return (
    <div className="learning-container">
      <LearningSidebar
        topics={topics}
        onTopicClick={(topicNoteId, topicVideoId, topicResourcesId) =>
          handleTopicClick(topicNoteId, topicVideoId, topicResourcesId)
        }
      />
      <div className="learning-content">
        <div className="section1 whiteboard">
          <h2>{unitName}</h2>
          <br />
          {selectedTopic && <h3>{selectedTopic}</h3>}
          {selectedNote ? (
            <div className="note-content">
              <br />
              <p>{selectedNote}</p>
            </div>
          ) : (
            <p>Select a topic to view its note.</p>
          )}
        </div>
        <div className="section2">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              Video
            </button>
            <button
              className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              Quiz
            </button>
            <button
              className={`tab ${activeTab === 'resource' ? 'active' : ''}`}
              onClick={() => setActiveTab('resource')}
            >
              Resources
            </button>
          </div>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
        <div className="section3">
          <h2>Section 3</h2>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
