import React, { useState } from 'react';
import Header from '../Header/Header';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch(`${window.location.origin}/djangoapp/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password, firstName, lastName, email }),
    });
    const json = await res.json();
    if (json.status === 'Authenticated') {
      sessionStorage.setItem('username', json.userName);
      window.location.href = '/';
    } else if (json.error === 'Already Registered') {
      setError('The user with the same username is already registered.');
    }
  };

  return (
    <div>
      <Header />
      <div className="container" style={{ maxWidth: 460, marginTop: 40 }}>
        <div className="card shadow-sm p-4">
          <h3 className="mb-3">Sign Up</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={register}>
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-person"></i> Username</label>
              <input type="text" name="username" className="form-control" placeholder="Username"
                value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-person-vcard"></i> First Name</label>
              <input type="text" name="first_name" className="form-control" placeholder="First Name"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-person-vcard"></i> Last Name</label>
              <input type="text" name="last_name" className="form-control" placeholder="Last Name"
                value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-envelope"></i> Email</label>
              <input type="email" name="email" className="form-control" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-lock"></i> Password</label>
              <input type="password" name="psw" className="form-control" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
