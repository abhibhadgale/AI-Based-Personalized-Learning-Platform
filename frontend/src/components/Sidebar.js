import React from 'react';
import { Link } from 'react-router-dom';

import "../styles/Sidebar.css"

const Sidebar = () => {
  return (
    <aside>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/resources">Resourses</Link></li>
        <li><Link to="/quiz">Quiz</Link></li>
        <li>AI Copilot</li>
        <li>Community</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
