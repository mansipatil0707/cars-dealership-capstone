import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const isLoggedIn = Boolean(sessionStorage.getItem('username'));

  const load = async (state) => {
    const path = state === 'All' ? 'get_dealers' : `get_dealers/${state}`;
    const res = await fetch(`${window.location.origin}/djangoapp/${path}`);
    const json = await res.json();
    if (json.status === 200) {
      const list = Array.from(json.dealers || []);
      setDealers(list);
      if (state === 'All') {
        setStates(Array.from(new Set(list.map((d) => d.state))).sort());
      }
    }
  };

  useEffect(() => {
    load('All');
  }, []);

  const onStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    load(value);
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-3">Dealerships</h2>
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>
                <select className="form-select form-select-sm" value={selectedState} onChange={onStateChange}>
                  <option value="All">State (All)</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </th>
              {isLoggedIn && <th>Review Dealer</th>}
            </tr>
          </thead>
          <tbody>
            {dealers.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td><a href={`/dealer/${d.id}`}>{d.full_name}</a></td>
                <td>{d.city}</td>
                <td>{d.address}</td>
                <td>{d.zip}</td>
                <td>{d.state}</td>
                {isLoggedIn && (
                  <td>
                    <a href={`/postreview/${d.id}`}>
                      <i className="bi bi-pencil-square fs-5" title="Review Dealer"></i> Review Dealer
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dealers;
