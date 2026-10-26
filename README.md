# Cars Dealership – Full-Stack Developer Capstone

**Project name:** Cars Dealership (Full-Stack Developer Capstone Project)

A responsive web application for **Cars Dealership**, a national car retailer in the U.S.
Users can browse dealership branches, filter them by state, read reviews, register / log in,
and post their own reviews. Each review is automatically tagged **positive / neutral / negative**
by a sentiment-analysis microservice.

## Architecture

```
React (built into Django static)  ──►  Django (port 8000)  ──►  Express + MongoDB (port 3030)  dealers & reviews
                                              │
                                              ├──►  Flask sentiment analyzer (port 5050)
                                              └──►  SQLite (users, CarMake, CarModel)
```

| Folder | Tech | Purpose |
|---|---|---|
| `server/` | Django, SQLite | Auth (login/logout/register), cars API, proxy to microservices, serves frontend |
| `server/frontend/` | React, static HTML/CSS | UI: Home, About, Contact, Login, Register, Dealers, Dealer, Post Review |
| `server/database/` | Node.js, Express, MongoDB | Dealerships and reviews REST API |
| `server/sentiment_analyzer/` | Flask, NLTK VADER | Sentiment analysis microservice |
| `.github/workflows/` | GitHub Actions | CI (lint + build) |
| `server/deployment.yaml` | Kubernetes | Deployment manifest for IBM Cloud Code Engine / K8s |

## Quick start (local)

For Windows PowerShell setup, troubleshooting, and submission evidence steps, see [`WINDOWS_SETUP.md`](WINDOWS_SETUP.md).

### 1. Dealer service (Express + MongoDB)
```bash
cd server/database
docker-compose up -d        # starts MongoDB + Express on :3030
```

### 2. Sentiment analyzer (Flask)
```bash
cd server/sentiment_analyzer
pip install -r requirements.txt
python app.py               # runs on :5050
```

### 3. Frontend build
```bash
cd server/frontend
npm install
npm run build
```

### 4. Django
```bash
cd server
python -m venv djangoenv && source djangoenv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser      # username: root
python manage.py runserver
```

Open http://localhost:8000/

## API endpoints (Django)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/djangoapp/login` | Log in (JSON `userName`, `password`) |
| GET | `/djangoapp/logout` | Log out |
| POST | `/djangoapp/register` | Register a new user |
| GET | `/djangoapp/get_cars` | All car makes and models |
| GET | `/djangoapp/get_dealers` | All dealers |
| GET | `/djangoapp/get_dealers/<state>` | Dealers by state |
| GET | `/djangoapp/dealer/<id>` | Dealer details |
| GET | `/djangoapp/reviews/dealer/<id>` | Reviews for a dealer (with sentiment) |
| POST | `/djangoapp/add_review` | Post a review |

Direct services:

| Service | Endpoint |
|---|---|
| Express | `GET :3030/fetchDealers`, `/fetchDealers/Kansas`, `/fetchDealer/1`, `/fetchReviews`, `/fetchReviews/dealer/1`, `POST /insert_review` |
| Sentiment | `GET :5050/analyze/Fantastic%20services` |

## Submission helper

See [`SUBMISSION_CHECKLIST.md`](SUBMISSION_CHECKLIST.md) for the exact file names, cURL commands,
and screenshots required for each of the 28 graded tasks.
