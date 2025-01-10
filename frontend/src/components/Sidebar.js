import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dashboard, MenuBook, Quiz, Group } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import "../styles/Sidebar.css";

const Sidebar = ({ onSidebarToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState('/');  // Add a selected state to track the active page

  // Notify parent component of sidebar expansion state change
  useEffect(() => {
    onSidebarToggle(isExpanded);
  }, [isExpanded, onSidebarToggle]);

  return (
    <aside
      className={isExpanded ? 'sidebar expanded' : 'sidebar'}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul>
        <li>
          <Link to="/" className={selected === '/' ? 'selected' : ''} onClick={() => setSelected('/')}>
            <Dashboard className="sidebar-icon" />
            {isExpanded && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/courses" className={selected === '/resources' ? 'selected' : ''} onClick={() => setSelected('/resources')}>
            <MenuBook className="sidebar-icon" />
            {isExpanded && <span>Courses</span>}
          </Link>
        </li>
        <li>
          <Link to="/quiz" className={selected === '/quiz' ? 'selected' : ''} onClick={() => setSelected('/quiz')}>
            <Quiz className="sidebar-icon" />
            {isExpanded && <span>Quiz</span>}
          </Link>
        </li>
        <li>
          <Link to="/ai-copilot" className={selected === '/ai-copilot' ? 'selected' : ''} onClick={() => setSelected('/ai-copilot')}>
            <SmartToyIcon className="sidebar-icon" />
            {isExpanded && <span>AI Copilot</span>}
          </Link>
        </li>
        <li>
          <Link to="/community" className={selected === '/community' ? 'selected' : ''} onClick={() => setSelected('/community')}>
            <Group className="sidebar-icon" />
            {isExpanded && <span>Community</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
