import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUnitTopicsThunk } from '../redux/slices/unitsSlice';
import LearningSidebar from '../components/LearningSidebar'; // Import the LearningSidebar
import '../styles/Learning.css';

const LearningPage = () => {
  const { unitId } = useParams();
  const dispatch = useDispatch();
  const { topics, loading, error, unitName } = useSelector((state) => state.units); // Added unitName to state

  useEffect(() => {
    dispatch(fetchUnitTopicsThunk(unitId)); // Fetch topics using the new action
  }, [dispatch, unitId]);

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>Error loading topics: {error}</p>;

  return (
    <div className="learning-container">
      <LearningSidebar topics={topics} /> {/* Pass topics to LearningSidebar */}
      <div className="learning-content">
          {/* Section 1 for notes */}
        <div className='section1'>
          <h2>Section 1: {unitName}</h2>
        </div>
          {/*Section 2 for vidio, quiz, resource */}
        <div className='section2'>
          <h2>Section 2</h2>
        </div>
          {/* Section 3 for future update*/}
        <div className='section3'>
          <h2>Section 3</h2>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
