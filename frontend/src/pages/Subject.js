// Subject.js (Page)

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllSubjects } from '../utils/api'; // Import the API function

import '../styles/Subject.css'

const Subject = () => {
  const { subject } = useParams();  // Get subject from URL params
  const [currentSubject, setCurrentSubject] = useState(null);  // Store current subject
  const navigate = useNavigate();  // Navigate function

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const { data } = await getAllSubjects();  // Fetch all subjects
        const subjectData = data.find((subj) => subj.subject === subject);  // Find subject
        setCurrentSubject(subjectData);  // Set the current subject state
      } catch (error) {
        console.error('Error fetching subject details:', error);
      }
    };

    fetchSubjectDetails();
  }, [subject]);  // Dependency on subject param

  const handleUnitClick = (unit) => {
    navigate(`/learning/${subject}/${unit.unitNumber}`);  // Navigate to Learning page
  };

  return (
    <div className="subject-container">
      <div className="subject-header">
        <h1>{subject} Page</h1>
        <p className="subject-description">Welcome to the {subject} subject page! Here you can view resources, take quizzes, and track your progress.</p>
      </div>

      <h2>Units:</h2>
      {currentSubject ? (
        <ul className="units-list">
          {currentSubject.units.map((unit) => (
            <li key={unit.unitNumber} onClick={() => handleUnitClick(unit)}>
              <h3>Unit {unit.unitNumber}: {unit.unitName}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading units...</p>
      )}
    </div>
  );
};

export default Subject;
