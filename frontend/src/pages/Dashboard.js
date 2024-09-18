import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentData, fetchLearningPath } from '../redux/slices/studentSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { progress, learningPath, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudentData());
    dispatch(fetchLearningPath());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Student Progress</h2>
      <pre>{JSON.stringify(progress, null, 2)}</pre>
      <h2>Learning Path</h2>
      <pre>{JSON.stringify(learningPath, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
