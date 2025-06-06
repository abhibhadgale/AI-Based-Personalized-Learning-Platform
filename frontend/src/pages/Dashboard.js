// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import Slider from "react-slick";
import { 
  fetchUserProfile, 
  getAllSubjects, 
  checkEnrollmentStatus, 
  getFITestCompletionStatus, 
  getQuizResultsByStudent,
  getSubjectUnits,
  getSubtopicCount,
  getCompletedTopicCount
} from "../utils/api";
import "../styles/Dashboard.css";
import "react-calendar/dist/Calendar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import welcome_banner from '../images/welcome_banner.png';
import { 
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#FFBB28"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="tooltip-date">{label}</p>
      <p className="tooltip-score">
        Score: {data.score}/{data.total} ({data.percentage}%)
      </p>
      {data.quizId?.title && (
        <p className="tooltip-quiz-name">Quiz: {data.quizId.title}</p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState(null);
  const [quizChartData, setQuizChartData] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [timeSpentData, setTimeSpentData] = useState([]);
  const [subjectProgressData, setSubjectProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch subject progress data
  const fetchSubjectProgress = async () => {
    const progressData = [];
    
    for (const subject of enrolledSubjects) {
      try {
        // Fetch subject units
        const { data: unitsData } = await getSubjectUnits(subject._id);
        const subjectUnits = [];
        
        // Fetch completed topics
        const completedTopicsRes = await getCompletedTopicCount();
        const completedTopicsByUnit = completedTopicsRes.data.completedTopicsByUnit || {};
        
        // Fetch subtopic counts for each unit
        for (const unit of unitsData.units) {
          try {
            const subtopicRes = await getSubtopicCount(unit.unitId);
            const completedTopics = completedTopicsByUnit[unit.unitId] || 0;
            const totalSubtopics = subtopicRes.data.totalSubtopics;
            const completionPercentage = Math.round((completedTopics / totalSubtopics) * 100);
            
            subjectUnits.push({
              unitId: unit.unitId,
              unitName: unit.unitName,
              unitNumber: unit.unitNumber,
              completionPercentage
            });
          } catch (error) {
            console.error(`Error fetching subtopics for unit ${unit.unitId}:`, error);
          }
        }
        
        progressData.push({
          subjectId: subject._id,
          subjectName: subject.subject,
          units: subjectUnits,
          // Calculate overall subject completion
          overallCompletion: Math.round(
            subjectUnits.reduce((sum, unit) => sum + unit.completionPercentage, 0) / 
            (subjectUnits.length || 1)
          )
        });
      } catch (error) {
        console.error(`Error fetching progress for subject ${subject.subject}:`, error);
      }
    }
    
    setSubjectProgressData(progressData);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileRes = await fetchUserProfile();
        const { user } = profileRes.data;
        setUserName(user.name || "User");
        setUserId(user._id);

        // Fetch quiz results
        const quizRes = await getQuizResultsByStudent();
        const rawQuizData = quizRes.data || [];

        // Transform quiz data for chart
        const quizChart = rawQuizData.map((quiz) => {
          const percentage = quiz.totalQuestions > 0
            ? Math.round((quiz.score / quiz.totalQuestions) * 100)
            : 0;
          
          return {
            date: new Date(quiz.quizDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            score: quiz.score,
            total: quiz.totalQuestions,
            percentage: percentage,
            rawDate: new Date(quiz.quizDate),
            quizId: quiz.quizId
          };
        }).sort((a, b) => a.rawDate - b.rawDate);

        setQuizChartData(quizChart);

        // Transform for time spent chart - group by week
        const timeSpentByWeek = rawQuizData.reduce((acc, quiz) => {
          const date = new Date(quiz.quizDate);
          const weekNumber = Math.floor(date.getDate() / 7) + 1;
          const weekKey = `Week ${weekNumber}`;
          
          if (!acc[weekKey]) {
            acc[weekKey] = 0;
          }
          acc[weekKey] += 0.5; // 30 minutes per quiz
          return acc;
        }, {});

        const timeSpentChartData = Object.entries(timeSpentByWeek).map(([name, hours]) => ({
          name,
          hours: Math.round(hours * 10) / 10
        }));

        setTimeSpentData(timeSpentChartData);

        // Fetch enrolled subjects
        const { data: subjects } = await getAllSubjects();
        const enrolled = [];

        for (const subject of subjects) {
          const { data: enrollmentData } = await checkEnrollmentStatus(subject._id);
          if (enrollmentData.isEnrolled) {
            enrolled.push(subject);
          }
        }

        setEnrolledSubjects(enrolled);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (enrolledSubjects.length > 0) {
      fetchSubjectProgress();
    }
  }, [enrolledSubjects]);

  const handleSubjectClick = async (subject) => {
    try {
      const { data: testCompleted } = await getFITestCompletionStatus(subject._id);
      if (testCompleted) {
        navigate(`/subject/${subject._id}`, { state: { subject } });
      } else {
        navigate(`/introduction/${subject.subject}`);
      }
    } catch (error) {
      console.error("Error checking FITest completion status:", error);
    }
  };

  // Sample progress data for calendar
  const progressData = {
    "2025-06-04": 1,
    "2025-06-01": 2,
    "2025-06-02": 3,
    "2025-06-03": 4,
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      },
    ],
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="left-section">
        <div className="welcome-container">
          <div className="welcome-text">
            <h1>Welcome back, {userName} 👋</h1>
            <p>
              Keep it up and improve your performance!
            </p>
          </div>
          <div className="welcome-image">
            <img src={welcome_banner} alt="Motivational" />
          </div>
        </div>

        <div className="enrolled-subjects">
          <h2>Your Subjects</h2>
          {enrolledSubjects.length > 0 ? (
            <Slider {...sliderSettings}>
              {enrolledSubjects.map((subject) => {
                const subjectProgress = subjectProgressData.find(
                  sp => sp.subjectId === subject._id
                );
                const completion = subjectProgress?.overallCompletion || 0;
                
                return (
                  <div key={subject._id} className="subject-card" onClick={() => handleSubjectClick(subject)}>
                    <img
                      src={subject.image || "default-image-url.jpg"}
                      alt={subject.subject}
                      className="subject-card-image"
                    />
                    <div className="subject-card-title">{subject.subject}</div>
                    <div className="completion-bar">
                      <div
                        className="completion-progress"
                        style={{ width: `${completion}%` }}
                      ></div>
                      <span>{completion}%</span>
                    </div>
                  </div>
                );
              })}
            </Slider>
          ) : (
            <p>You are not enrolled in any subjects yet. Start exploring courses now!</p>
          )}
        </div>
        
        <div className="analytics-section">
          <div className="chart-container">
            <h3>Quiz Performance Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={quizChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="percentage" 
                  name="Score (%)" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Time Spent on Quizzes</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value) => [`${value} hours`, "Time Spent"]}
                  labelFormatter={(label) => `Week: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="hours" 
                  name="Time Spent (hours)" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Hierarchical Progress Chart */}
<div className="progress-section">
  <h3>Subject & Unit Progress</h3>
  <div className="progress-container">
    {subjectProgressData.map((subject) => (
      <div key={subject.subjectId} className="subject-progress">
        <div className="subject-header">
          <h4>{subject.subjectName}</h4>
          <div className="overall-completion">
            Overall: {isNaN(subject.overallCompletion) ? '0%' : `${subject.overallCompletion}%`}
          </div>
        </div>

        <div className="units-progress">
          {subject.units.map((unit) => {
            const percentage = isNaN(unit.completionPercentage)
              ? 0
              : unit.completionPercentage;

            return (
              <div key={unit.unitId} className="unit-progress">
                <div className="unit-info">
                  <span>Unit {unit.unitNumber}: {unit.unitName}</span>
                </div>
                <div className="completion-bar">
                  <div
                    className="completion-progress"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <span>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
</div>

      </div>

      <div className="right-section">
        <h2 className="calendar-heading">My Progress</h2>
        <Calendar
          tileClassName={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            const intensity = progressData[formattedDate];
            return intensity ? `progress-${intensity}` : "";
          }}
        />

        <div className="legend">
          <p>Low <span style={{ backgroundColor: "#d4e7ff" }}></span></p>
          <p><span style={{ backgroundColor: "#8fcaff" }}></span></p>
          <p><span style={{ backgroundColor: "#529aff" }}></span></p>
          <p><span style={{ backgroundColor: "#0056b3" }}></span> High</p>
        </div>

        <div className="upcoming-tasks">
          <h2 className="upcoming-tasks-heading">Upcoming Tasks</h2>
          <div className="task-list">
            <div className="task-item">
              <span className="task-icon">📝</span>
              <span className="task-name">
                Complete Software Engineering Assignment 1
              </span>
              <button className="task-arrow">➤</button>
            </div>
            <div className="task-item">
              <span className="task-icon">📚</span>
              <span className="task-name">
                Prepare for Software Engineering Midterms
              </span>
              <button className="task-arrow">➤</button>
            </div>
            <div className="task-item">
              <span className="task-icon">📅</span>
              <span className="task-name">
                Review Software Engineering Lecture Notes
              </span>
              <button className="task-arrow">➤</button>
            </div>
            <div className="task-item">
              <span className="task-icon">👩‍💻</span>
              <span className="task-name">
                Complete Software Engineering Lab
              </span>
              <button className="task-arrow">➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;