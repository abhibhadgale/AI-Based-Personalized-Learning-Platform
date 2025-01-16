// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import Slider from "react-slick"; // Importing React Slick

import { fetchUserProfile, getAllSubjects, checkEnrollmentStatus, getFITestCompletionStatus } from "../utils/api";

import "../styles/Dashboard.css";
import "react-calendar/dist/Calendar.css";
import "slick-carousel/slick/slick.css"; // React Slick styles
import "slick-carousel/slick/slick-theme.css";
import welcome_banner from '../images/welcome_banner.png'

const Dashboard = () => {

  const [userName, setUserName] = useState("User");
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledSubjects = async () => {
      try {
        const { data } = await getAllSubjects();
        const enrolled = [];
        for (const subject of data) {
          const { data: enrollmentData } = await checkEnrollmentStatus(
            subject._id
          );
          if (enrollmentData.isEnrolled) {
            enrolled.push(subject);
          }
        }
        setEnrolledSubjects(enrolled);
      } catch (error) {
        console.error("Error fetching enrolled subjects:", error);
      }
    };

    fetchEnrolledSubjects();
  }, []);


  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchUserProfile(); // Fetch user profile from the backend
        const { user } = response.data;
        setUserName(user.name || "User"); // Set the user's name dynamically
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  const handleSubjectClick = async (subject) => {
    try {
      // Check if the student has completed the FITest
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

  // Sample progress data
  const progressData = {
    "2025-01-10": 1,
    "2025-01-11": 2,
    "2025-01-12": 3,
    "2025-01-13": 4, // Intensity: 1 (low) to 4 (full)
  };

  // Function to get background color based on intensity
  const getTileColor = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const intensity = progressData[formattedDate] || 0;

    switch (intensity) {
      case 1:
        return "#d4e7ff"; // Light blue
      case 2:
        return "#8fcaff"; // Medium blue
      case 3:
        return "#529aff"; // Darker blue
      case 4:
        return "#0056b3"; // Dark blue
      default:
        return "transparent";
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Number of items to show
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Adjust for tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // Adjust for mobile
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className="dashboard-container">
      <div className="left-section">
        <div className="welcome-container">
          <div className="welcome-text">
            <h1>Welcome back, {userName} 👋</h1>
            <p>
              You’ve completed 50% of the syllabus for your semester exam.
              <br />
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
              {enrolledSubjects.map((subject) => (
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
                      style={{ width: `${subject.completion || 0}%` }} // Dynamic progress width
                    ></div>
                    <span>{subject.completion || 0}%</span>{" "}
                    {/* Dynamic percentage display */}
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p>You are not enrolled in any subjects yet. Start exploring courses now!</p>
          )}
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
          <p>
            Low <span style={{ backgroundColor: "#d4e7ff" }}></span>
          </p>
          <p>
            <span style={{ backgroundColor: "#8fcaff" }}></span>
          </p>
          <p>
            <span style={{ backgroundColor: "#529aff" }}></span>
          </p>
          <p>
            <span style={{ backgroundColor: "#0056b3" }}></span> High
          </p>
        </div>

        {/* Upcoming Tasks Section */}
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
