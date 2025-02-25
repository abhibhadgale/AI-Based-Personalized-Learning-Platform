import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import NotesIcon from "@mui/icons-material/Notes";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import QuizIcon from "@mui/icons-material/Quiz";
import LinkIcon from "@mui/icons-material/Link";
import { fetchUnitTopicsThunk } from "../redux/slices/unitsSlice";
import {
  updateProgress,
  syncProgressWithBackend,
  markSkippedSubtopic,
} from "../redux/slices/studentProgressSlice";
import LearningSidebar from "../components/LearningSidebar";
import "../styles/Learning.css";
import {
  fetchNoteById,
  fetchVideoById,
  fetchResourceById,
  fetchDiagramById,
  fetchSubtopicById,
  getStudentProgress,
} from "../utils/api";
import Quiz from "../components/Quiz";
import Chatbot from "../components/Chatbot";

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, unitName, subjectId } = useSelector((state) => state.units);
  const studentProgress = useSelector(
    (state) => state.studentProgress.progress
  );

  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(0);
  const [checkedSubtopics, setCheckedSubtopics] = useState({});
  const [activeTab, setActiveTab] = useState("notes");
  const [showNextButton, setShowNextButton] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [activeSubtopicId, setActiveSubtopicId] = useState(null);

  const [selectedContent, setSelectedContent] = useState({
    note: null,
    video: null,
    resource: null,
    quizId: null,
    diagram: null,
    subtopicName: "",
    subtopicId: null,
  });

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId));
    fetchStudentProgress();
  }, [dispatch, unitId]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      dispatch(syncProgressWithBackend(studentProgress));
    }, 30000);
    return () => clearInterval(syncInterval);
  }, [dispatch, studentProgress]);

  const fetchStudentProgress = async () => {
    try {
      const { data } = await getStudentProgress();
      if (data.progress) {
        const completedSubtopics = {};
        data.progress.forEach(({ unitId: progressUnitId, subtopicId }) => {
          if (progressUnitId === unitId) {
            completedSubtopics[subtopicId] = true;
          }
        });
        setCheckedSubtopics(completedSubtopics);
      }
    } catch (error) {
      console.error("Error fetching student progress:", error);
    }
  };

  const handleSubtopicClick = async (subtopicId) => {
    try {
      if (activeSubtopicId && activeSubtopicId !== subtopicId && !checkedSubtopics[activeSubtopicId]) {
        dispatch(
          markSkippedSubtopic({
            unitId,
            subtopicId: activeSubtopicId,
            endTime: new Date().toISOString(),
          })
        );
      }
  
      setStartTime(new Date().toISOString());
      setActiveSubtopicId(subtopicId);
  
      const { data: subtopicData } = await fetchSubtopicById(subtopicId);
  
      const [noteRes, videoRes, resourceRes, diagramRes] = await Promise.all([
        fetchNoteById(subtopicData.subtopicNoteId),
        fetchVideoById(subtopicData.subtopicVideoId),
        fetchResourceById(subtopicData.subtopicResourcesId),
        subtopicData.subtopicDiagramId
          ? fetchDiagramById(subtopicData.subtopicDiagramId)
          : { data: { imageBase64: null } },
      ]);
  
      setSelectedContent({
        note: noteRes?.data?.note || "",
        video: videoRes?.data?.link || "",
        resource: resourceRes?.data?.resource || "",
        quizId: subtopicData?.subtopicQuizId || null,
        diagram: diagramRes?.data?.imageBase64 || null,
        subtopicName: subtopicData?.subtopicName || "",
        subtopicId: subtopicData?._id || null,
      });
  
      setActiveTab("notes");
  
      const flatSubtopics = topics.flatMap((topic) => topic.subtopics);
      const newIndex = flatSubtopics.findIndex(
        (sub) => sub.subtopicId === subtopicId
      );
      if (newIndex !== -1) setCurrentSubtopicIndex(newIndex);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };
  

  const handleNextClick = () => {
    if (activeTab !== "quiz") {
      setActiveTab("quiz");
      setShowNextButton(false);
    }
  };

  const handleNextSubtopic = () => {
    if (!topics.length) return;

    const flatSubtopics = topics.flatMap((topic) => topic.subtopics);

    if (
      currentSubtopicIndex < 0 ||
      currentSubtopicIndex >= flatSubtopics.length
    )
      return;

    const completedSubtopicId = flatSubtopics[currentSubtopicIndex].subtopicId;

    setCheckedSubtopics((prev) => ({
      ...prev,
      [completedSubtopicId]: true,
    }));

    dispatch(updateProgress({ unitId, subtopicId: completedSubtopicId, startTime, endTime: new Date().toISOString() }));

    const nextIndex = currentSubtopicIndex + 1;

    if (nextIndex < flatSubtopics.length) {
      const nextSubtopic = flatSubtopics[nextIndex];
      handleSubtopicClick(nextSubtopic.subtopicId);
      setCurrentSubtopicIndex(nextIndex);
    }
  };

  const handleQuizSubmit = () => {
    handleNextSubtopic();
    setShowNextButton(true);
  };

  const renderSection1Content = () => {
    switch (activeTab) {
      case "video":
        return selectedContent.video ? (
          <div
            className="video-content"
            dangerouslySetInnerHTML={{ __html: selectedContent.video }}
          />
        ) : (
          <p>Select a subtopic to view its video.</p>
        );

      case "quiz":
        return selectedContent.quizId ? (
          <Quiz
            quizId={selectedContent.quizId}
            subjectId={subjectId}
            onSubmit={handleQuizSubmit}
          />
        ) : (
          <p>Select a subtopic to view its quiz.</p>
        );

      case "resource":
        return selectedContent.resource ? (
          <a
            href={selectedContent.resource}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-link-button"
          >
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
                <h3>{selectedContent.subtopicName}</h3>
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => (
                        <ul className="custom-list">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="custom-list-item">{children}</li>
                      ),
                    }}
                  >
                    {selectedContent.note}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <p>Select a subtopic to view its note.</p>
            )}

            {selectedContent.diagram && (
              <div className="diagram-content">
                <h3>Diagram:</h3>
                <img
                  src={`${selectedContent.diagram}`}
                  alt="Diagram"
                  className="diagram"
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="learning-container">
      <LearningSidebar
        topics={topics}
        onSubtopicClick={handleSubtopicClick}
        checkedSubtopics={checkedSubtopics}
      />
      <div className="learning-content">
        <div className="section1">
          <h2>{unitName}</h2>
          {renderSection1Content()}
          {showNextButton && (
            <div className="next-button-container">
              <button onClick={handleNextClick} className="next-button">
                Next
              </button>
            </div>
          )}
        </div>
        <div className="section2">
          <div className="tabs">
            {[
              { tab: "notes", icon: <NotesIcon /> },
              { tab: "video", icon: <VideoLibraryIcon /> },
              { tab: "quiz", icon: <QuizIcon /> },
              { tab: "resource", icon: <LinkIcon /> },
            ].map(({ tab, icon }) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {icon}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="section3">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
