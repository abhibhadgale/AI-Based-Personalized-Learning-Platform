import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUnitTopicsThunk } from '../redux/slices/unitsSlice';
import LearningSidebar from '../components/LearningSidebar'; // Import the LearningSidebar
import '../styles/Learning.css';
import { fetchNoteById } from '../utils/api'; // Import API call for fetching note

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, loading, error, unitName } = useSelector((state) => state.units);
  const [selectedNote, setSelectedNote] = useState(null); // State to store the selected note
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // State to manage the selected tab

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId)); // Fetch topics using the new action
  }, [dispatch, unitId]);

  // Function to handle topic click and fetch the corresponding note
  const handleTopicClick = async (topicNoteId) => {
    try {
      const response = await fetchNoteById(topicNoteId); // Fetch the note by topicNoteId
      setSelectedNote(response.data.note); // Update state with the fetched note
      setSelectedTopic(response.data.topicName);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  // Function to render tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'video':
        return <p>This is the video content.</p>;
      case 'quiz':
        return <p>This is the quiz content.</p>;
      case 'resource':
        return <p>This is the resource content.</p>;
      default:
        return null;
    }
  };

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>Error loading topics: {error}</p>;

  return (
    <div className="learning-container">
      <LearningSidebar topics={topics} onTopicClick={handleTopicClick} /> {/* Pass handleTopicClick to sidebar */}
      <div className="learning-content">
        {/* Section 1 for notes */}
        <div className='section1 whiteboard'>
          <h2>{unitName}</h2>
          <br />
          {selectedTopic && <h3>{selectedTopic}</h3>}
          {selectedNote ? (
            <div className='note-content'>
              <br />
              <p>{selectedNote}</p>
            </div>
          ) : (
            <p>Select a topic to view its note.</p>
          )}
        </div>
        {/* Section 2 for tabs (video, quiz, resources) */}
        <div className='section2'>
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
          <div className="tab-content">
            {renderTabContent()} {/* Dynamically render content based on the active tab */}
          </div>
        </div>
        {/* Section 3 for future updates */}
        <div className='section3'>
          <h2>Section 3</h2>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
