# Cars Dealership Capstone — Windows setup

This repository contains the application source. The cURL outputs, screenshots, GitHub URLs, and cloud deployment URL must be generated from your own running instance; they are not fabricated in this package.

## Requirements

- Git and Node.js 18 or newer
- Python 3.11 recommended
- Docker Desktop (for MongoDB + Express) or a MongoDB instance
- IBM Cloud CLI and Code Engine plugin only if you are deploying to IBM Cloud

## 1. Start the Express dealership API and MongoDB

Open PowerShell in the project folder:

```powershell
cd server/database
docker compose up -d --build
```

The API should listen on `http://localhost:3030`. Check `http://localhost:3030/` in a browser. The initial data is loaded into empty collections; restarting the service will not intentionally delete existing reviews.

## 2. Start the sentiment analyzer

Open a second PowerShell window from the project root:

```powershell
cd server/sentiment_analyzer
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

Check `http://localhost:5050/analyze/Fantastic%20services`. It should return JSON with a positive sentiment.

## 3. Build the React frontend

Open a third PowerShell window:

```powershell
cd server/frontend
npm install
npm run build
```

A successful build creates `server/frontend/build/`.

## 4. Start Django

Open a fourth PowerShell window:

```powershell
cd server
py -3.11 -m venv djangoenv
.\djangoenv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

For the admin account, enter the username `root` if you want to use the sample cURL command; set your own strong password and remember it for the tests. Open `http://localhost:8000/`.

## 5. Generate cURL evidence files

Keep Django and the other services running. In a new PowerShell window, use Git Bash or another Bash shell to run:

```bash
USER_NAME=root USER_PASS='your-real-password' bash tools/curl_tests.sh
```

The script writes command/output evidence to `submission_outputs/`. Review each response before submitting. If a service is down, its output will show an error; do not submit that as successful evidence.

## 6. GitHub and screenshots

1. Create a public repository you control and push this project.
2. Use the repository's actual GitHub URLs for the README, About page, Contact page, and Register.jsx.
3. Take the requested screenshots from your own running application with the browser address bar visible where specified.
4. For CI/CD evidence, open the GitHub repository's **Actions** tab and capture the actual successful workflow run.
5. For deployment tasks, deploy the services to a cloud environment, test the public URL, and record the URL you actually receive.

## Troubleshooting

- `docker` is not recognized: install/start Docker Desktop, or configure a reachable MongoDB instance and set `MONGO_URL` for the Express service.
- Dealer endpoints return an empty result or 500: check the Express logs and MongoDB connection first.
- Reviews fail to post: sign in through the application first and check the Express logs.
- Django cannot reach a microservice: set `backend_url` and `sentiment_analyzer_url` environment variables to the reachable service URLs.
