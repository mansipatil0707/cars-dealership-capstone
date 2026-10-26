import React, { useState } from 'react';
import Header from '../Header/Header';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch(`${window.location.origin}/djangoapp/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password }),
    });
    const json = await res.json();
    if (json.status === 'Authenticated') {
      sessionStorage.setItem('username', json.userName);
      window.location.href = '/';
    } else {
      setError('The user could not be authenticated.');
    }
  };

  return (
    <div>
      <Header />
      <div className="container" style={{ maxWidth: 420, marginTop: 60 }}>
        <div className="card shadow-sm p-4">
          <h3 className="mb-3">Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={login}>
            <input type="text" className="form-control mb-3" placeholder="Username"
              value={userName} onChange={(e) => setUserName(e.target.value)} required />
            <input type="password" className="form-control mb-3" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className="mt-3 mb-0 text-center">
            New here? <a href="/register/">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
