import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import { fetchUnitTopicsThunk } from '../redux/slices/unitsSlice';
import LearningSidebar from '../components/LearningSidebar';
import '../styles/Learning.css';
import { fetchNoteById, fetchVideoById, fetchResourceById, fetchDiagramById, fetchSubtopicById } from '../utils/api';
import Quiz from '../components/Quiz';

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, status, error, unitName, unitMcqTest, subjectId } = useSelector((state) => state.units);

  const [selectedContent, setSelectedContent] = useState({
    note: null,
    video: null,
    resource: null,
    quizId: null,
    diagram: null,
    subtopicName: '',  // 🔑 Added to store the subtopic name
  });

  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId));
  }, [dispatch, unitId]);

  const handleSubtopicClick = async (subtopicId) => {
    try {
      const { data: subtopicData } = await fetchSubtopicById(subtopicId);

      const [noteRes, videoRes, resourceRes, diagramRes] = await Promise.all([
        fetchNoteById(subtopicData.subtopicNoteId),
        fetchVideoById(subtopicData.subtopicVideoId),
        fetchResourceById(subtopicData.subtopicResourcesId),
        subtopicData.subtopicDiagramId ? fetchDiagramById(subtopicData.subtopicDiagramId) : Promise.resolve({ data: { imageBase64: null } }),
      ]);

      setSelectedContent({
        note: noteRes.data.note,
        video: videoRes.data.link,
        resource: resourceRes.data.resource,
        quizId: subtopicData.subtopicQuizId,
        diagram: diagramRes.data.imageBase64,
        subtopicName: subtopicData.subtopicName, // ✅ Storing the subtopic name
      });

      setActiveTab('notes');
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const renderSection1Content = () => {
    switch (activeTab) {
      case 'video':
        return selectedContent.video ? (
          <div className="video-content" dangerouslySetInnerHTML={{ __html: selectedContent.video }} />
        ) : (
          <p>Select a subtopic to view its video.</p>
        );

      case 'quiz':
        return selectedContent.quizId ? (
          <Quiz quizId={selectedContent.quizId} subjectId={subjectId} />
        ) : (
          <p>Select a subtopic to view its quiz.</p>
        );

      case 'resource':
        return selectedContent.resource ? (
          <a href={selectedContent.resource} target="_blank" rel="noopener noreferrer" className="resource-link-button">
            <LinkIcon /> View Resource
          </a>
        ) : (
          <p>Select a subtopic to view its resource.</p>
        );

      default:
        return (
          <>
            {selectedContent.note ? (
              <div className="note-content">
                <h3>{selectedContent.subtopicName}</h3>  {/* ✅ Displaying the subtopic name */}
                <p>{selectedContent.note}</p>
              </div>
            ) : (
              <p>Select a subtopic to view its note.</p>
            )}

            {selectedContent.diagram && (
              <div className="diagram-content">
                <h3>Diagram:</h3>
                <img src={`${selectedContent.diagram}`} alt="Diagram" className="diagram" />
              </div>
            )}
          </>
        );
    }
  };

  const renderSection2Tabs = () => (
    <div className="tabs">
      {['notes', 'video', 'quiz', 'resource'].map((tab) => (
        <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );

  if (status === 'loading') return <p>Loading topics...</p>;
  if (status === 'failed') return <p>Error loading topics: {error}</p>;

  return (
    <div className="learning-container">
      <LearningSidebar topics={topics} onSubtopicClick={handleSubtopicClick} unitMcqTest={unitMcqTest} subjectId={subjectId} />
      <div className="learning-content">
        <div className="section1">
          <h2>{unitName}</h2>
          {renderSection1Content()}
        </div>
        <div className="section2">{renderSection2Tabs()}</div>
        <div className="section3">
          <iframe
            className="bot"
            title="bot"
            src="https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2024/10/16/19/20241016194039-D7DSDT66.json"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
