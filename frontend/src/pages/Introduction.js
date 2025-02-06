import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectfundamental } from "../utils/api";

import "../styles/Introduction.css"

const Introduction = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [introduction, setIntroduction] = useState(null);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        console.log("Fetching introduction for subject:", subject); // Log the subject before making the request
        const response = await subjectfundamental(subject);
        
        console.log("API response received:", response.data); // Log the API response
        setIntroduction(response.data);
      } catch (error) {
        console.error("Error fetching introduction:", error); // Log any error
      }
    };
  
    fetchIntroduction();
  }, [subject]);
  
  // Handle navigation to the test page, passing the fundamentalQuizID
  const handleTakeTest = () => {
    if (introduction && introduction.fundamentalQuizID) {
      navigate(`/fitest/${introduction.fundamentalQuizID}`);  // Navigate with the fundamentalQuizID
    } else {
      console.error("Quiz ID not found");
    }
  };

  if (!introduction) return <div>Loading...</div>;

  return (
    <div className="introductioncontainer">
      <h1>{introduction.title}</h1>
      <p>{introduction.description}</p>
      <div className="testbuttoncontainer">
        <button className="testbutton" onClick={handleTakeTest}>Take a Test</button>
      </div>
    </div>
  );
};

export default Introduction;
