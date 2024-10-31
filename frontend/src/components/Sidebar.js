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
        <li><Link to="/ai-copilot">AI Copilot</Link></li>
        <li><Link to="/community">Community</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
