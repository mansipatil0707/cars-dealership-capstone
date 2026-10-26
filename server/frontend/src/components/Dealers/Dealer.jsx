import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const sentimentIcon = {
  positive: 'bi-emoji-smile-fill text-success',
  neutral: 'bi-emoji-neutral-fill text-warning',
  negative: 'bi-emoji-frown-fill text-danger',
};

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const isLoggedIn = Boolean(sessionStorage.getItem('username'));

  useEffect(() => {
    const load = async () => {
      const base = window.location.origin;
      const dealerRes = await (await fetch(`${base}/djangoapp/dealer/${id}`)).json();
      if (dealerRes.status === 200 && Array.isArray(dealerRes.dealer) && dealerRes.dealer.length) {
        setDealer(dealerRes.dealer[0]);
      }
      const reviewRes = await (await fetch(`${base}/djangoapp/reviews/dealer/${id}`)).json();
      if (reviewRes.status === 200) {
        setReviews(reviewRes.reviews);
      }
      setLoaded(true);
    };
    load();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        {dealer && (
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>{dealer.full_name}</h2>
              <h5 className="text-muted">
                {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
              </h5>
            </div>
            {isLoggedIn && (
              <a className="btn btn-primary" href={`/postreview/${id}`}>
                <i className="bi bi-pencil-square"></i> Post Review
              </a>
            )}
          </div>
        )}

        <h4 className="mt-4">Reviews</h4>
        {!loaded && <p>Loading reviews…</p>}
        {loaded && reviews.length === 0 && <p>No reviews yet!</p>}
        <div className="row g-3">
          {reviews.map((r) => (
            <div className="col-12 col-md-6" key={r.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">{r.name}</h6>
                    <i className={`bi ${sentimentIcon[r.sentiment] || sentimentIcon.neutral} fs-4`}
                      title={r.sentiment}></i>
                  </div>
                  <p className="mb-2">{r.review}</p>
                  <small className="text-muted">
                    {r.car_make} {r.car_model} {r.car_year}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dealer;
