import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import analyze_review_sentiments, get_request, post_review

logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    """Handle a sign-in request."""
    if request.method != "POST":
        return JsonResponse({"message": "POST required"}, status=405)
    try:
        data = json.loads(request.body or b"{}")
        username = data["userName"]
        password = data["password"]
    except (json.JSONDecodeError, KeyError, TypeError):
        return JsonResponse({"message": "Invalid login payload"}, status=400)
    user = authenticate(username=username, password=password)
    response = {"userName": username}
    if user is not None:
        login(request, user)
        response = {"userName": username, "status": "Authenticated"}
    return JsonResponse(response)


def logout_request(request):
    """Handle a sign-out request."""
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    """Handle a sign-up request."""
    if request.method != "POST":
        return JsonResponse({"message": "POST required"}, status=405)
    try:
        data = json.loads(request.body or b"{}")
        username = data["userName"]
        password = data["password"]
        first_name = data["firstName"]
        last_name = data["lastName"]
        email = data["email"]
    except (json.JSONDecodeError, KeyError, TypeError):
        return JsonResponse({"message": "Invalid registration payload"}, status=400)

    if not username or not password:
        return JsonResponse({"message": "Username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=password,
        email=email,
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


def get_cars(request):
    """Return all car makes and models (seeds the DB on first call)."""
    if not CarMake.objects.exists():
        initiate()
    car_models = CarModel.objects.select_related("car_make")
    cars = [
        {"CarModel": car_model.name, "CarMake": car_model.car_make.name}
        for car_model in car_models
    ]
    return JsonResponse({"CarModels": cars})


def get_dealerships(request, state="All"):
    """Return all dealers, or those in the given state."""
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(request, dealer_id):
    """Return details for a single dealer."""
    if dealer_id:
        dealership = get_request(f"/fetchDealer/{dealer_id}")
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_reviews(request, dealer_id):
    """Return reviews for a dealer, each tagged with its sentiment."""
    if dealer_id:
        reviews = get_request(f"/fetchReviews/dealer/{dealer_id}")
        if not isinstance(reviews, list):
            return JsonResponse({"status": 200, "reviews": []})
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail["review"])
            review_detail["sentiment"] = response.get("sentiment", "neutral")
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


@csrf_exempt
def add_review(request):
    """Post a review (only for authenticated users)."""
    if request.user.is_anonymous:
        return JsonResponse({"status": 403, "message": "Unauthorized"})
    try:
        data = json.loads(request.body)
        result = post_review(data)
        if result is None:
            return JsonResponse({"status": 502, "message": "Review service unavailable"}, status=502)
        return JsonResponse({"status": 200, "review": result})
    except Exception as err:
        logger.error("Error in posting review: %s", err)
        return JsonResponse({"status": 401, "message": "Error in posting review"})
