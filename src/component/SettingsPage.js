import React, { useState } from 'react';
import { Moon, Sun, Globe, Bell } from 'lucide-react';
import '../component/styling/settings.css';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You would typically implement dark mode logic here
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className={`settings-container ${darkMode ? 'dark' : ''}`}>
      <div className="settings-card">
        <h2>System Settings</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <div className="icon-container">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <span>Dark Mode</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={toggleDarkMode} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <div className="icon-container">
              <Globe size={20} />
            </div>
            <span>Language</span>
          </div>
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="language-select"
          >
            <option value="english">English</option>
            <option value="zulu">Zulu</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <div className="icon-container">
              <Bell size={20} />
            </div>
            <span>Notifications</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={toggleNotifications} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-footer">
          <button className="save-btn">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;