import React from "react";

function Header({ userName, onLogout }) {
  return (
    <div className="header">
      <h1>Notes Keeper</h1>
      <div className="header-user">
        {userName && <span>Welcome, {userName}!</span>}
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Header;