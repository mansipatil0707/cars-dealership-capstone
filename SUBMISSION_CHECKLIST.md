# Submission Checklist (28 tasks / 50 points)

Everything marked **YOU** must be produced on your own machine, because the grader checks your
repo, your running app and your deployment. Run the app, then create each file / screenshot below.

## Run order
1. Start MongoDB + Express: `cd server/database && docker-compose up -d`
2. Start sentiment service: `cd server/sentiment_analyzer && pip install -r requirements.txt && python app.py`
3. Build frontend: `cd server/frontend && npm install && npm run build`
4. Django: `cd server && pip install -r requirements.txt && python manage.py makemigrations && python manage.py migrate && python manage.py createsuperuser` (username `root`) then `python manage.py runserver`
5. Make sure a normal user exists for login tests (register one in the UI, or use `root`).

## Tasks

| # | What to submit | How |
|---|---|---|
| 1 | GitHub URL of `README.md` | Push repo as **public**, copy the README file URL |
| 2 | File `django_server` | Paste the terminal output of `python manage.py runserver` |
| 3 | GitHub URL of `server/frontend/static/About.html` | Push, copy file URL |
| 4 | GitHub URL of `server/frontend/static/Contact.html` | Push, copy file URL |
| 5 | File `loginuser` | `curl -X POST -H "Content-Type: application/json" -d '{"userName":"root","password":"<pwd>"}' http://localhost:8000/djangoapp/login` (paste command + output) |
| 6 | File `logoutuser` | `curl http://localhost:8000/djangoapp/logout` (paste command + output) |
| 7 | GitHub URL of `server/frontend/src/components/Register/Register.jsx` | Push, copy file URL |
| 8 | File `getdealerreviews` | `curl http://localhost:8000/djangoapp/reviews/dealer/1` |
| 9 | File `getalldealers` | `curl http://localhost:8000/djangoapp/get_dealers` |
| 10 | File `getdealerbyid` | `curl http://localhost:8000/djangoapp/dealer/1` |
| 11 | File `getdealersbyState` | `curl http://localhost:8000/djangoapp/get_dealers/Kansas` |
| 12 | `admin_login.png` | Open `/admin`, log in as `root`, screenshot the admin page |
| 13 | `admin_logout.png` | Click Log out, screenshot the "logged out" page |
| 14/15 | File `getallcarmakes` | `curl http://localhost:8000/djangoapp/get_cars` |
| 16 | File `analyzereview` | `curl http://localhost:5050/analyze/Fantastic%20services` (or your deployed sentiment URL) |
| 17 | `get_dealers.png` | `/dealers/` before login |
| 18 | `get_dealers_loggedin.png` | `/dealers/` after login — show username, Review Dealer, address bar |
| 19 | `dealersbystate.png` | `/dealers/` with state filter (e.g. Kansas), address bar visible |
| 20 | `dealer_id_reviews.png` | `/dealer/<id>` with reviews, address bar visible |
| 21 | `dealership_review_submission.png` | Post Review page filled in, before clicking Post |
| 22 | `added_review.png` | Dealer page showing your new review |
| 23 | File `CICD` | Paste the GitHub Actions run log (Actions tab → latest run → steps) |
| 24 | File `deploymentURL` | Your IBM Cloud Code Engine app URL |
| 25 | `deployed_landingpage.png` | Deployed URL home page |
| 26 | `deployed_loggedin.png` | Deployed app, logged in, username visible |
| 27 | `deployed_dealer_detail.png` | Deployed dealer detail page |
| 28 | `deployed_add_review.png` | Deployed page showing the review you added |

`tools/curl_tests.sh` prints all the cURL commands with their outputs and the file name each one belongs in.

## Deployment (Tasks 24–28)
```bash
# Sentiment service
cd server/sentiment_analyzer
ibmcloud ce application create --name sentianalyzer --build-source . --port 5000 --min-scale 1 --max-scale 2

# Express/Mongo service: use MongoDB Atlas (or any hosted Mongo) and set MONGO_URL
cd ../database
ibmcloud ce application create --name dealersapi --build-source . --port 3030 --env MONGO_URL="<mongo-uri>" --min-scale 1

# Django (set backend_url / sentiment_analyzer_url to the two URLs above)
cd ..
ibmcloud ce application create --name dealership --build-source . --port 8000 \
  --env backend_url="https://<dealersapi-url>" --env sentiment_analyzer_url="https://<sentianalyzer-url>/" --min-scale 1
```
Add your Django app URL to `CSRF_TRUSTED_ORIGINS` in `server/djangoproj/settings.py` if needed.
