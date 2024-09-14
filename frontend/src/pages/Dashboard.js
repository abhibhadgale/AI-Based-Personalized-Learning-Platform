import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import { setProgress } from '../redux/slices/studentAnalyticsSlice';
import "../styles/Dashboard.css";

const Dashboard = () => {
    const progress = useSelector((state) => state.analytics.progress);
    const dispatch = useDispatch();
  
    const updateProgress = () => {
      dispatch(setProgress({ chapter: "React Basics", completed: 50 }));
    };
  
    return (
      <div>
        <h1>Continue Learning</h1>
        <p>Learning path or learning progression will be here</p>
        <p>Current Progress: {progress.completed}%</p>
        <button onClick={updateProgress}>Update Progress</button>
        <hr></hr>
        <h1>Student Analysis</h1>
        <p>Student performance and analysis will be here</p>
      </div>
    );
  };
  
export default Dashboard;
