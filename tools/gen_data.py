"""Generate sample dealerships.json, reviews.json and car_records.json for the Express service."""
import json
import os
import random

random.seed(42)

OUT = os.path.join(os.path.dirname(__file__), "..", "server", "database")

# (id, city, state, st, address, zip, lat, long, short_name, full_name)
DEALERS = [
    (1, "El Paso", "Texas", "TX", "3 Nova Court", "88563", "31.6948", "-106.3", "Holdlamis", "Holdlamis Car Dealership"),
    (2, "Minneapolis", "Minnesota", "MN", "6337 Butternut Crossing", "55402", "44.9778", "-93.265", "Temp", "Temp Car Dealership"),
    (3, "Birmingham", "Alabama", "AL", "9477 Twin Pines Center", "35285", "33.5207", "-86.8025", "Sub-Ex", "Sub-Ex Car Dealership"),
    (4, "Wichita", "Kansas", "KS", "9 Harbort Parkway", "67210", "37.6872", "-97.3301", "Wichita Motors", "Wichita Motors Car Dealership"),
    (5, "Topeka", "Kansas", "KS", "4 Warner Road", "66606", "39.0473", "-95.6752", "Topeka Auto", "Topeka Auto Car Dealership"),
    (6, "Overland Park", "Kansas", "KS", "88 Metcalf Avenue", "66212", "38.9822", "-94.6708", "OP Cars", "Overland Park Cars Dealership"),
    (7, "Kansas City", "Kansas", "KS", "120 State Avenue", "66101", "39.1141", "-94.6275", "KC Wheels", "Kansas City Wheels Dealership"),
    (8, "Austin", "Texas", "TX", "1500 Congress Avenue", "78701", "30.2672", "-97.7431", "Lone Star Auto", "Lone Star Auto Dealership"),
    (9, "Houston", "Texas", "TX", "700 Main Street", "77002", "29.7604", "-95.3698", "Bayou Motors", "Bayou Motors Dealership"),
    (10, "Saint Paul", "Minnesota", "MN", "45 Summit Avenue", "55102", "44.9537", "-93.09", "North Star", "North Star Car Dealership"),
    (11, "Montgomery", "Alabama", "AL", "200 Dexter Avenue", "36104", "32.3668", "-86.3", "Capital Autos", "Capital Autos Dealership"),
    (12, "Los Angeles", "California", "CA", "300 Sunset Boulevard", "90028", "34.0522", "-118.2437", "Sunset Cars", "Sunset Cars Dealership"),
    (13, "San Diego", "California", "CA", "55 Harbor Drive", "92101", "32.7157", "-117.1611", "Pacific Motors", "Pacific Motors Dealership"),
    (14, "New York", "New York", "NY", "10 Broadway", "10004", "40.7128", "-74.006", "Empire Auto", "Empire Auto Dealership"),
    (15, "Buffalo", "New York", "NY", "77 Niagara Street", "14201", "42.8864", "-78.8784", "Lakeside Cars", "Lakeside Cars Dealership"),
]

MAKES = {
    "NISSAN": ["Pathfinder", "Qashqai", "XTRAIL"],
    "Mercedes": ["A-Class", "C-Class", "E-Class"],
    "Audi": ["A4", "A5", "A6"],
    "Kia": ["Sorrento", "Carnival", "Cerato"],
    "Toyota": ["Camry", "Corolla", "RAV4"],
}

POSITIVE = [
    "Fantastic services! The staff were friendly and helped me find the perfect car.",
    "Great experience from start to finish. Highly recommend this dealership.",
    "Excellent customer service and a very smooth buying process.",
    "Amazing team, very knowledgeable and no pressure at all. Love my new car!",
    "Wonderful dealership. They offered a fair price and delivered on time.",
]
NEUTRAL = [
    "The process was okay. Nothing special but nothing wrong either.",
    "Average experience. The car is fine and the paperwork took a while.",
    "Decent selection of cars. Service was acceptable.",
]
NEGATIVE = [
    "Terrible experience. The salesperson was pushy and the wait was far too long.",
    "Poor service and hidden fees. I would not recommend this dealership.",
    "Very disappointed. The car was not ready on the promised date.",
]

NAMES = ["Alice Johnson", "Brian Smith", "Carla Gomez", "David Lee", "Emma Brown",
         "Farhan Ali", "Grace Kim", "Henry Wilson", "Isha Patel", "Jack Turner"]

reviews = []
rid = 1
for dealer in DEALERS:
    for _ in range(random.randint(2, 4)):
        make = random.choice(list(MAKES))
        model = random.choice(MAKES[make])
        text = random.choice(POSITIVE + NEUTRAL + NEGATIVE)
        reviews.append({
            "id": rid,
            "name": random.choice(NAMES),
            "dealership": dealer[0],
            "review": text,
            "purchase": random.choice([True, False]),
            "purchase_date": f"{random.randint(1, 12):02d}/{random.randint(1, 28):02d}/{random.choice([2022, 2023, 2024])}",
            "car_make": make,
            "car_model": model,
            "car_year": random.choice([2020, 2021, 2022, 2023]),
        })
        rid += 1

dealerships = [
    {
        "id": d[0], "city": d[1], "state": d[2], "st": d[3], "address": d[4],
        "zip": d[5], "lat": d[6], "long": d[7], "short_name": d[8], "full_name": d[9],
    }
    for d in DEALERS
]

car_records = [
    {"dealer_id": d[0], "make": make, "model": model, "bodyType": "SUV", "year": 2023, "mileage": random.randint(1000, 60000)}
    for d in DEALERS
    for make, models in list(MAKES.items())[:2]
    for model in models[:1]
]

with open(os.path.join(OUT, "dealerships.json"), "w") as f:
    json.dump({"dealerships": dealerships}, f, indent=2)
with open(os.path.join(OUT, "reviews.json"), "w") as f:
    json.dump({"reviews": reviews}, f, indent=2)
with open(os.path.join(OUT, "car_records.json"), "w") as f:
    json.dump({"cars": car_records}, f, indent=2)

print(f"dealerships={len(dealerships)} reviews={len(reviews)} cars={len(car_records)}")
