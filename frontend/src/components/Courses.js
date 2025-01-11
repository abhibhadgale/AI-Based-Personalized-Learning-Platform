import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSubjects, getFITestCompletionStatus, checkEnrollmentStatus } from "../utils/api"; // Fetch subjects & test status from the backend
import "../styles/Courses.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const Courses = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("comp");
  const [selectedYear, setSelectedYear] = useState("se");
  const [selectedSem, setSelectedSem] = useState("2");
  const [showSubjects, setShowSubjects] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await getAllSubjects();
        setSubjects(data);
        // Fetch enrollment status for each subject
        const status = {};
        for (const subject of data) {
          const { data: enrollmentData } = await checkEnrollmentStatus(subject._id);
          status[subject._id] = enrollmentData.isEnrolled;
        }
        setEnrollmentStatus(status);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectSelect = async (subject) => {
    // Function to check if the user is logged in
    const isLoggedIn = () => {
      const token = localStorage.getItem("token"); // Assuming you store the auth token in localStorage
      return !!token; // Returns true if token exists, otherwise false
    };

    if (!isLoggedIn()) {
      // Redirect to login page if not logged in
      alert("You need to log in to enroll in a course.");
      navigate("/login");
      return;
    }

    // Check if the user is enrolled
    try {
      const { data: enrollmentStatus } = await checkEnrollmentStatus(subject._id);

      if (!enrollmentStatus.isEnrolled) {
        // Redirect to the enroll course page if the user is not enrolled
        navigate("/enroll-course", { state: { subject } });
        return;
      }

      // Check if the student has completed the fitest
      const { data: testCompleted } = await getFITestCompletionStatus(subject._id);

      if (testCompleted) {
        navigate(`/subject/${subject._id}`, { state: { subject } });
      } else {
        navigate(`/introduction/${subject.subject}`);
      }
    } catch (error) {
      console.error("Error checking enrollment or test status:", error);
    }
  };

  const handleApply = () => {
    if (
      selectedBranch === "comp" &&
      selectedYear === "se" &&
      selectedSem === "2"
    ) {
      setShowSubjects(true);
    } else {
      setShowSubjects(false);
    }
  };

  return (
    <div className="courses-container">
      <div className="header">
        <h2>Courses for you</h2>
        <p>Based on updated SPPU syllabus</p>
      </div>

      <div className="maindiv">
        {/* Left Section */}
        <div className="div1">
          <div className="filter-container">
            <h4 className="filter-by-text">Filter By</h4>

            <div className="filter-column">
              Branch
              <label>
                <input
                  type="checkbox"
                  checked={selectedBranch === "comp"}
                  onChange={() => setSelectedBranch("comp")}
                />
                Computer Engineering
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBranch === "it"}
                  onChange={() => setSelectedBranch("it")}
                />
                Information Technology
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBranch === "entc"}
                  onChange={() => setSelectedBranch("entc")}
                />
                Electronics and Telecommunication
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBranch === "mech"}
                  onChange={() => setSelectedBranch("mech")}
                />
                Mechanical Engineering
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedBranch === "civil"}
                  onChange={() => setSelectedBranch("civil")}
                />
                Civil Engineering
              </label>
            </div>

            <div className="filter-column">
              Year
              <label>
                <input
                  type="checkbox"
                  checked={selectedYear === "fe"}
                  onChange={() => setSelectedYear("fe")}
                />
                First Year
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYear === "se"}
                  onChange={() => setSelectedYear("se")}
                />
                Second Year
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYear === "te"}
                  onChange={() => setSelectedYear("te")}
                />
                Third Year
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedYear === "be"}
                  onChange={() => setSelectedYear("be")}
                />
                Fourth Year
              </label>
            </div>

            <div className="filter-column">
              Semester
              <label>
                <input
                  type="checkbox"
                  checked={selectedSem === "1"}
                  onChange={() => setSelectedSem("1")}
                />
                Semester 1
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedSem === "2"}
                  onChange={() => setSelectedSem("2")}
                />
                Semester 2
              </label>
            </div>
            {/* Apply Button */}
            <button className="apply-button" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="div2">
          {showSubjects ? (
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {subjects.map((subject, index) => (
                <SwiperSlide key={index}>
                  <div className="subject-container">
                    <img
                      src={subject.image || ""}
                      alt={subject.subject}
                      className={`subject-image ${
                        selectedSubject?.name === subject.subject
                          ? "active"
                          : ""
                      }`}
                    />
                    <div className="subject-title">{subject.subject}</div>

                    <div className="subject-info">Comp SE-Sem2</div>
                    <div className="subject-rating">
                      Rating: {subject.rating || "N/A"} ⭐
                    </div>
                    <div className="subject-buttons">
                      <button
                        className="view-course-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click
                          navigate(`/view-course/${subject._id}`);
                        }}
                      >
                        View Course
                      </button>
                      <button
                        className="enroll-now-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click
                          handleSubjectSelect(subject); // Enroll functionality moved here
                        }}
                      >
                        {enrollmentStatus[subject._id] ? "Continue Learning" : "Enroll Now"}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="coming-soon-banner">
              <h2>Coming Soon!</h2>
              <p>The selected combination is not available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
