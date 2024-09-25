import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { getSubjectUnits } from '../utils/api';
import '../styles/Subject.css';  // Import the CSS file

const Subject = () => {
  const { subjectID } = useParams();  // Get subjectID from URL params
  const [currentUnits, setCurrentUnits] = useState([]);
  const [subjectName, setSubjectName] = useState('');  // State to hold the subject name
  const navigate = useNavigate();  // useNavigate hook for programmatic navigation

  useEffect(() => {
    const fetchSubjectUnits = async () => {
      try {
        const { data } = await getSubjectUnits(subjectID);  // Fetch units and subject data using subjectID
        setCurrentUnits(data.units);  // Set the units in state
        setSubjectName(data.subject);  // Set the subject name in state
        console.log("data", data.unit.unitId)
      } catch (error) {
        console.error('Error fetching subject units:', error);
      }
    };

    fetchSubjectUnits();
  }, [subjectID]);

  // Handle click on a unit
  const handleUnitClick = (unitId ,unitName) => {
    console.log("unitId:", unitId)
    console.log(subjectName, unitName)
    const encodedUnitName = encodeURIComponent(unitName);  // URL-encode the unit name
    navigate(`/learning/${encodeURIComponent(subjectName)}/${encodedUnitName}/${unitId}`);  // Navigate with subject name, unit name, and unitId
  };

  return (
    <div className="subject-container">
      <h1 className="subject-title">{subjectName}</h1> {/* Render subject name */}
      <h2 className="subject-units-title">Units</h2>
      <ul className="units-list">
        {currentUnits.map((unit) => (
          <li 
            key={unit._id} 
            className="unit-item" 
            onClick={() => handleUnitClick(unit.unitId ,unit.unitName)} // Trigger navigation on click
          >
            <span className="unit-number">Unit {unit.unitNumber}:</span>
            <span className="unit-name"> {unit.unitName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subject;
