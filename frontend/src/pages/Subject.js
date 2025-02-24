import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSubjectUnits,
  getSubtopicCount,
  getCompletedTopicCount,
} from "../utils/api";
import "../styles/Subject.css";

const Subject = () => {
  const { subjectID } = useParams();
  const [currentUnits, setCurrentUnits] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [completedTopicsByUnit, setCompletedTopicsByUnit] = useState({});
  const [subtopicCounts, setSubtopicCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subject units
        const { data } = await getSubjectUnits(subjectID);
        setCurrentUnits(data.units);
        setSubjectName(data.subject);

        // Fetch completed topics
        const completedTopicsRes = await getCompletedTopicCount();
        setCompletedTopicsByUnit(completedTopicsRes.data.completedTopicsByUnit || {});

        // Fetch subtopic counts for each unit
        const subtopicData = {};
        await Promise.all(
          data.units.map(async (unit) => {
            try {
              const subtopicRes = await getSubtopicCount(unit.unitId);
              subtopicData[unit.unitId] = subtopicRes.data.totalSubtopics;
            } catch (error) {
              console.error(`Error fetching subtopics for unit ${unit.unitId}:`, error);
              subtopicData[unit.unitId] = 1; // Default value to avoid division errors
            }
          })
        );
        setSubtopicCounts(subtopicData);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchData();
  }, [subjectID]);

  const handleUnitClick = (unitId, unitName) => {
    const encodedUnitName = encodeURIComponent(unitName);
    navigate(`/learning/${encodeURIComponent(subjectName)}/${encodedUnitName}/${unitId}`);
  };

  return (
    <div className="subjectcontainer">
      <h1 className="subject-title">{subjectName}</h1>
      <h2 className="subject-units-title">Units</h2>
      <ul className="units-list">
        {currentUnits.map((unit) => {
          const completedTopics = completedTopicsByUnit[unit.unitId] || 0;
          const totalSubtopics = subtopicCounts[unit.unitId] || 1;
          const completionPercentage = Math.round((completedTopics / totalSubtopics) * 100);

          return (
            <li key={unit._id} className="unit-item" onClick={() => handleUnitClick(unit.unitId, unit.unitName)}>
              <div className="unit-info">
                <span className="unit-number">Unit {unit.unitNumber}:</span>
                <span className="unit-name"> {unit.unitName}</span>
              </div>

              {/* Dynamic Completion Bar */}
              <div className="completion-bar">
                <div className="completion-progress" style={{ width: `${completionPercentage}%` }}></div>
                <span>{completionPercentage}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Subject;
