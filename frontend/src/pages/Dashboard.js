import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentData, fetchLearningPath } from '../redux/slices/studentSlice';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { progress, learningPath, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudentData());
    dispatch(fetchLearningPath());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error.message || 'Something went wrong'}</p>;

  return (
    <div className="dashboard">
      <section className="progress-section">
        <h2>Student Progress</h2>
        <div className="progress-content">
          <div className="progress-card">
            <h3>Completed Courses</h3>
            {progress && progress.completedCourses && progress.completedCourses.length > 0 ? (
              <ul>
                {progress.completedCourses.map((course) => (
                  <li key={course.courseId}>
                    {course.courseName} (Completed on: {new Date(course.completionDate).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No completed courses.</p>
            )}
          </div>
          <div className="progress-card">
            <h3>Current Courses</h3>
            {progress && progress.currentCourses && progress.currentCourses.length > 0 ? (
              <ul>
                {progress.currentCourses.map((course) => (
                  <li key={course.courseId}>
                    {course.courseName} (Progress: {course.progressPercentage}%)
                  </li>
                ))}
              </ul>
            ) : (
              <p>No current courses.</p>
            )}
          </div>
          <div className="progress-card">
            <h3>Quiz Scores</h3>
            {progress && progress.quizScores && progress.quizScores.length > 0 ? (
              <ul>
                {progress.quizScores.map((score) => (
                  <li key={score.quizId}>
                    Quiz ID: {score.quizId} (Score: {score.score}, Date: {new Date(score.date).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No quiz scores available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="learning-path-section">
        <h2>Learning Path</h2>
        <div className="learning-path-content">
          {learningPath && learningPath.path && learningPath.path.length > 0 ? (
            <ul>
              {learningPath.path.map((module) => (
                <li key={module.moduleId} className={module.completed ? 'completed' : 'in-progress'}>
                  {module.moduleName} {module.completed ? '(Completed)' : '(In Progress)'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No learning path available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
