import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { SquareCheck as CheckSquare, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <nav className="navbar w-[100%]">
      <div className="navbar-container">
        <div className="navbar-brand">
          <CheckSquare size={24} />
          <span>TaskFlow</span>
        </div>
        
        <div className="navbar-menu">
          <div 
            className="user-menu"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <User size={20} />
            <span>{user}</span>
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <button onClick={handleLogout} className="dropdown-item">
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;