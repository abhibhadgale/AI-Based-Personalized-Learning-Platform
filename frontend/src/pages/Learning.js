import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Learning.css';

const Learning = () => {
  const { subject, unit } = useParams();

  return (
    <div className="learning-container">
      <div className="learning-header">
        <h1>{subject} - Learning Unit</h1>
        <h2>Unit: {unit}</h2>
      </div>
      <div className="learning-content">
        <p>
          Here you can access the materials and resources for the {unit} unit of {subject}. 
          This section will include lessons, quizzes, and other learning materials.
        </p>
      </div>

      <div className="learning-resources">
        <h3>Additional Resources</h3>
        <ul>
          <li>Recommended Books for {subject}</li>
          <li>Online Tutorials for {subject}</li>
          <li>Practice Quizzes</li>
        </ul>
      </div>
    </div>
  );
};

export default Learning;
