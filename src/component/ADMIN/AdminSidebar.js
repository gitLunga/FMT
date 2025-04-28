import { 
    Home, 
    Users, 
    ClipboardList, 
    Settings, 
    ChevronLeft,
    PlusCircle,
    FileText,
    FileSignature,
    LogOut
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  
  const Sidebar = ({ collapsed, setCollapsed, activeTab, setActiveTab }) => {
    const navigate = useNavigate();
  
    const handleNavigation = (path) => {
      navigate(path);
      // Update active tab based on path
      const tabMap = {
        '/dashboard': 'dashboard',
        '/players': 'players',
        '/reports': 'reports',
        '/settings': 'settings'
      };
      setActiveTab(tabMap[path] || activeTab);
    };
  
    return (
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed ? (
            <div className="brand">
             
            </div>
          ) : (
            <div className="logo-collapsed">⚽</div>
          )}
        </div>
  
        <nav className="sidebar-nav">
          {/* Main Navigation Items */}
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavigation("/dashboard")}
          >
            <Home size={20} />
            {!collapsed && <span>Dashboard</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "players" ? "active" : ""}`}
            onClick={() => handleNavigation("/ViewPlayers")}
          >
            <Users size={20} />
            {!collapsed && <span>Players</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => handleNavigation("/reports")}
          >
            <ClipboardList size={20} />
            {!collapsed && <span>Reports</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => handleNavigation("/settings")}
          >
            <Settings size={20} />
            {!collapsed && <span>Settings</span>}
          </button>
  
          {/* Action Items - Separated with divider */}
          <div className="sidebar-divider"></div>
          
          <button 
            className="nav-item action-item"
            onClick={() => {
              navigate("/playerform");
              setActiveTab("players"); // Keep players tab active
            }}
          >
            <PlusCircle size={20} />
            {!collapsed && <span>Add Player</span>}
          </button>
          
          <button 
            className="nav-item action-item"
            onClick={() => {
              navigate("/PlayerPerformanceForm");
              setActiveTab("reports"); // Keep reports tab active
            }}
          >
            <FileText size={20} />
            {!collapsed && <span>Add Report</span>}
          </button>
          
          <button 
            className="nav-item action-item"
            onClick={() => {
              navigate("/PlayerContractForm");
              setActiveTab("players"); // Contracts relate to players
            }}
          >
            <FileSignature size={20} />
            {!collapsed && <span>Add Contract</span>}
          </button>
          
          {/* Logout at the bottom */}
          <div className="sidebar-spacer"></div>
          
          <button 
            className="nav-item logout-item"
            onClick={() => {
              // Handle logout logic
              navigate("/login");
            }}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
  
        <div className="sidebar-footer">
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={`icon ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    );
  };
  
  export default Sidebar;