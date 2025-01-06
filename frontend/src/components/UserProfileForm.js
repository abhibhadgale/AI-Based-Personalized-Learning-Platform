import React, { useState } from 'react';
import { submitUserProfile, updateUserProfileCompleted } from '../utils/api';
import { useNavigate } from 'react-router-dom'; 
import '../styles/UserProfileForm.css';

const UserProfileForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        college: '',
        degree: '',
        yearOfStudy: '',
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({
        preferredLearningStyles: [],
        productivityTime: [],
        studyPreferences: [],
        helpfulContent: [],
        reviewFrequency: [],
        studyHours: '',
        goalSetting: '',
        motivation: '',
        distractionFrequency: '',
        onlineLearningComfort: '',
        learningPreference: '',
        quizFrequency: '',
        challenges: '',
        suggestions: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading


    const questions = [
        {
            question: "Preferred Learning Style:",
            options: ["Visual (Videos, Images, Diagrams)", "Auditory (Lectures, Podcasts)", "Reading/Writing (Text Notes, Articles)", "Kinesthetic (Hands-on Practice, Projects)"],
            name: "preferredLearningStyles",
            type: "checkbox"
        },
        {
            question: "When do you feel most productive?",
            options: ["Early Morning", "Afternoon", "Evening", "Late Night"],
            name: "productivityTime",
            type: "checkbox"
        },
        {
            question: "How do you prefer studying?",
            options: ["Short study sessions with breaks", "Long uninterrupted study sessions"],
            name: "studyPreferences",
            type: "checkbox"
        },
        {
            question: "Which content do you find most helpful for learning?",
            options: ["Videos", "Notes/Articles", "Quizzes/Tests", "Flashcards"],
            name: "helpfulContent",
            type: "checkbox"
        },
        {
            question: "How often do you review past topics?",
            options: ["Daily", "Weekly", "Before Exams Only", "Rarely"],
            name: "reviewFrequency",
            type: "checkbox"
        },
        {
            question: "How many hours do you study per day (on average)?",
            name: "studyHours",
            type: "text"
        },
        {
            question: "Do you set specific goals before studying?",
            options: ["Always", "Sometimes", "Rarely", "Never"],
            name: "goalSetting",
            type: "radio"
        },
        {
            question: "What motivates you to study?",
            options: ["Personal Interest", "Good Grades", "External Pressure (Parents/Peers)", "Career Goals"],
            name: "motivation",
            type: "radio"
        },
        {
            question: "How often do you face distractions during study sessions?",
            options: ["Frequently", "Occasionally", "Rarely"],
            name: "distractionFrequency",
            type: "radio"
        },
        {
            question: "How comfortable are you with online learning platforms?",
            options: ["Very Comfortable", "Moderately Comfortable", "Slightly Uncomfortable", "Not Comfortable at All"],
            name: "onlineLearningComfort",
            type: "radio"
        },
        {
            question: "Do you prefer learning with:",
            options: ["Self-paced courses", "Instructor-led sessions"],
            name: "learningPreference",
            type: "radio"
        },
        {
            question: "How frequently do you take quizzes/tests?",
            options: ["Regularly (at least once a week)", "Occasionally", "Only before exams"],
            name: "quizFrequency",
            type: "radio"
        },
        {
            question: "What challenges do you face while studying?",
            name: "challenges",
            type: "textarea"
        },
        {
            question: "Any suggestions for improvement in the learning platform?",
            name: "suggestions",
            type: "textarea"
        },
    ];

    const handleBasicDataSubmit = (e) => {
        e.preventDefault();
        setCurrentQuestionIndex(1); // Move to the first question after submitting basic info
    };

    const handleQuestionChange = (e) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            // Handle checkbox input
            setResponses((prev) => {
                const currentResponses = prev[name] || [];
                if (currentResponses.includes(value)) {
                    return {
                        ...prev,
                        [name]: currentResponses.filter((item) => item !== value),
                    };
                } else {
                    return {
                        ...prev,
                        [name]: [...currentResponses, value],
                    };
                }
            });
        } else if (type === "radio") {
            // Set the value directly for radio buttons
            setResponses((prev) => ({ ...prev, [name]: value }));
        } else {
            // Handle text or textarea inputs
            setResponses((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleNextQuestion = (e) => {
        e.preventDefault();
        if (currentQuestionIndex < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Handle final submission logic here
            handleSubmitForm();
        }
    };

    const handleSubmitForm = async () => {
        setIsSubmitting(true);
        try {
            const profileData = { ...formData, ...responses };
            await submitUserProfile(profileData); // Submit the data to the backend
            // After submitting the user profile, update profileCompleted to true
            await updateUserProfileCompleted();

            alert('Profile created successfully!');

            navigate('/');
        } catch (error) {
            console.error('Error submitting profile:', error);
            alert('Failed to submit profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="user-profile-container">
            <h1>User Profile</h1>
            {currentQuestionIndex === 0 ? (
                <form className="user-profile-form" onSubmit={handleBasicDataSubmit}>
                    <div className="form-group">
                        <label>Age:</label>
                        <input
                            type="number"
                            name="age"
                            className="form-field"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>College:</label>
                        <input
                            type="text"
                            name="college"
                            className="form-field"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Degree:</label>
                        <select
                            name="degree"
                            className="form-field"
                            value={formData.degree}
                            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            required
                        >
                            <option value="">Select a Degree</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics and Telecommunication">Electronics and Telecommunication</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Year of Study:</label>
                        <select
                            name="yearOfStudy"
                            className="form-field"
                            value={formData.yearOfStudy}
                            onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="1st year">1st Year</option>
                            <option value="2nd year">2nd Year</option>
                            <option value="3rd year">3rd Year</option>
                            <option value="4th year">4th Year</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
                    </button>
                </form>
            ) : (
                <form className="user-profile-form" onSubmit={handleNextQuestion}>
                    <div className="question-container">
                        <h2>{questions[currentQuestionIndex - 1].question}</h2>
                        {questions[currentQuestionIndex - 1].type === 'textarea' ? (
                            <textarea
                                name={questions[currentQuestionIndex - 1].name}
                                className="form-field"
                                value={responses[questions[currentQuestionIndex - 1].name]}
                                onChange={handleQuestionChange}
                            />
                        ) : questions[currentQuestionIndex - 1].type === 'text' ? (
                            <input
                                type="text"
                                name={questions[currentQuestionIndex - 1].name}
                                className="form-field"
                                value={responses[questions[currentQuestionIndex - 1].name] || ''}
                                onChange={handleQuestionChange}
                            />
                        ) : (
                            questions[currentQuestionIndex - 1].options.map((option) => (
                                <label key={option}>
                                    <input
                                        type={questions[currentQuestionIndex - 1].type}
                                        value={option}
                                        checked={responses[questions[currentQuestionIndex - 1].name]?.includes(option)}
                                        name={questions[currentQuestionIndex - 1].name}
                                        onChange={handleQuestionChange}
                                    />
                                    {option}
                                </label>
                            ))
                        )}
                    </div>
                    <button type="submit" className="submit-button">
                        {currentQuestionIndex < questions.length ? 'Next' : 'Submit'}
                    </button>
                </form>
                

            )}
            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${((currentQuestionIndex - 1) / questions.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default UserProfileForm;
