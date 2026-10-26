"""Helpers that call the Express (dealers/reviews) and Flask (sentiment) services."""
import requests
from urllib.parse import quote
from django.conf import settings

backend_url = (getattr(settings, "backend_url", "http://localhost:3030"))
sentiment_analyzer_url = (getattr(settings, "sentiment_analyzer_url", "http://localhost:5050/"))

TIMEOUT = 10


def get_request(endpoint, **kwargs):
    """GET <backend_url>/<endpoint>?<kwargs> and return parsed JSON (or None)."""
    params = "&".join(f"{key}={value}" for key, value in kwargs.items())
    request_url = f"{backend_url}{endpoint}"
    if params:
        request_url = f"{request_url}?{params}"
    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url, timeout=TIMEOUT)
        return response.json()
    except Exception as err:  # network or JSON errors
        print(f"Network exception occurred: {err}")
        return None


def analyze_review_sentiments(text):
    """Call the sentiment analyzer microservice and return its JSON."""
    request_url = f"{sentiment_analyzer_url}analyze/{quote(str(text), safe='')}"
    try:
        response = requests.get(request_url, timeout=TIMEOUT)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    """POST a review to the Express service."""
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=TIMEOUT)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        print(f"Network exception occurred: {err}")
        return None

