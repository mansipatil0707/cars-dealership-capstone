import React from 'react';

const Header = () => {
  const currUser = sessionStorage.getItem('username');

  const logout = async () => {
    await fetch(`${window.location.origin}/djangoapp/logout`, { method: 'GET' });
    sessionStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: '#0d3b66' }}>
      <div className="container">
        <a className="navbar-brand text-white" href="/">
          <i className="bi bi-car-front-fill"></i> Cars Dealership
        </a>
        <ul className="navbar-nav ms-auto flex-row gap-3 align-items-center">
          <li className="nav-item"><a className="nav-link text-white" href="/">Home</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="/about/">About Us</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="/contact/">Contact Us</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="/dealers/">Dealerships</a></li>
          {currUser ? (
            <>
              <li className="nav-item text-warning fw-bold">{currUser}</li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><a className="nav-link text-white" href="/login/">Login</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="/register/">Register</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
