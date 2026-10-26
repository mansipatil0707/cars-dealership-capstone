import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [carmodels, setCarmodels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const base = window.location.origin;
      const d = await (await fetch(`${base}/djangoapp/dealer/${id}`)).json();
      if (d.status === 200 && Array.isArray(d.dealer) && d.dealer.length) {
        setDealer(d.dealer[0]);
      }
      const c = await (await fetch(`${base}/djangoapp/get_cars`)).json();
      setCarmodels(Array.from(c.CarModels || []));
    };
    load();
  }, [id]);

  const postReview = async () => {
    let name = `${sessionStorage.getItem('firstname') || ''} ${sessionStorage.getItem('lastname') || ''}`.trim();
    if (!name) name = sessionStorage.getItem('username');

    if (!model || !review || !date || !year) {
      setError('All details are mandatory.');
      return;
    }
    const [make, ...rest] = model.split(' ');
    const payload = JSON.stringify({
      name,
      dealership: Number(id),
      review,
      purchase: true,
      purchase_date: date,
      car_make: make,
      car_model: rest.join(' '),
      car_year: Number(year),
    });

    const res = await fetch(`${window.location.origin}/djangoapp/add_review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `/dealer/${id}`;
    } else {
      setError('Could not post the review. Please log in and try again.');
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-4" style={{ maxWidth: 700 }}>
        <h2>{dealer ? dealer.full_name : 'Post Review'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <label className="form-label mt-3">Your review</label>
        <textarea className="form-control" rows="5" value={review}
          onChange={(e) => setReview(e.target.value)} placeholder="Write your experience…"></textarea>

        <label className="form-label mt-3">Purchase date</label>
        <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />

        <label className="form-label mt-3">Car make and model</label>
        <select className="form-select" value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="" disabled>Choose car make and model</option>
          {carmodels.map((c, i) => (
            <option key={i} value={`${c.CarMake} ${c.CarModel}`}>{c.CarMake} {c.CarModel}</option>
          ))}
        </select>

        <label className="form-label mt-3">Car year</label>
        <input type="number" className="form-control" min="2015" max="2025" value={year}
          onChange={(e) => setYear(e.target.value)} />

        <button className="btn btn-primary mt-4" onClick={postReview}>Post Review</button>
      </div>
    </div>
  );
};

export default PostReview;
