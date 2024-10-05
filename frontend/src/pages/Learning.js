import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import { fetchUnitTopicsThunk } from '../redux/slices/unitsSlice';
import LearningSidebar from '../components/LearningSidebar';
import '../styles/Learning.css';
import { fetchNoteById, fetchVideoById, fetchResourceById, fetchDiagramById } from '../utils/api'; // Added fetchDiagramById
import Quiz from '../components/Quiz';

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, loading, error, unitName, unitMcqTest, subjectId } = useSelector((state) => state.units);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedDiagram, setSelectedDiagram] = useState(null); // State for diagram
  const [activeTab, setActiveTab] = useState('notes'); // Default to 'notes' tab

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId));
  }, [dispatch, unitId]);

  const handleTopicClick = async (topicNoteId, topicVideoId, topicResourcesId, topicQuizId, topicDiagramId) => {
    try {
      const noteResponse = await fetchNoteById(topicNoteId);
      setSelectedNote(noteResponse.data.note);

      const videoResponse = await fetchVideoById(topicVideoId);
      setSelectedVideo(videoResponse.data.link);

      const resourceResponse = await fetchResourceById(topicResourcesId);
      setSelectedResource(resourceResponse.data.resource);

      setSelectedQuizId(topicQuizId);

      if (topicDiagramId) {
        const diagramResponse = await fetchDiagramById(topicDiagramId); // Fetch diagram
        setSelectedDiagram(diagramResponse.data.imageBase64); // Store the diagram
      } else {
        setSelectedDiagram(null); // Clear diagram if no diagramId
      }

      setActiveTab('notes'); // Set default tab to 'notes' when a topic is clicked
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const renderSection1Content = () => {
    switch (activeTab) {
      case 'video':
        return selectedVideo ? (
          <div className="video-content" dangerouslySetInnerHTML={{ __html: selectedVideo }} />
        ) : (
          <p>Select a topic to view its video.</p>
        );
      case 'quiz':
        return selectedQuizId ? (
          <Quiz quizId={selectedQuizId} subjectId={subjectId} />
        ) : (
          <p>Select a topic to view its quiz.</p>
        );
      case 'resource':
        return selectedResource ? (
          <a href={selectedResource} target="_blank" rel="noopener noreferrer" className="resource-link-button">
            <LinkIcon /> View Resource
          </a>
        ) : (
          <p>Select a topic to view its resource.</p>
        );
      default:
        return (
          <>
            {selectedNote ? (
              <div className="note-content">
                <h3>Notes</h3>
                <p>{selectedNote}</p>
              </div>
            ) : (
              <p>Select a topic to view its note.</p>
            )}
            {/* Render diagram below the note */}
            {selectedDiagram && (
              <div className="diagram-content">
                <h3>Diagram:</h3>
                <img src={`${selectedDiagram}`} alt="Diagram" className="diagram" />
              </div>
            )}
          </>
        );
    }
  };

  const renderSection2Tabs = () => {
    return (
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
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
    );
  };

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>Error loading topics: {error}</p>;

  return (
    <div className="learning-container">
      <LearningSidebar
        topics={topics}
        onTopicClick={(topicNoteId, topicVideoId, topicResourcesId, topicQuizId, topicDiagramId) =>
          handleTopicClick(topicNoteId, topicVideoId, topicResourcesId, topicQuizId, topicDiagramId)
        }
        unitMcqTest={unitMcqTest} // Pass unitMcqTest to sidebar
        subjectId={subjectId}
      />
      <div className="learning-content">
        <div className="section1">
          <h2>{unitName}</h2>
          {renderSection1Content()}
        </div>
        <div className="section2">
          {renderSection2Tabs()}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
