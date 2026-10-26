"""Seed the SQLite database with car makes and models."""
from .models import CarMake, CarModel

MAKES = [
    ("NISSAN", "Japanese automaker known for reliable and affordable vehicles.", "Japan", 1933),
    ("Mercedes", "German luxury automaker known for engineering and comfort.", "Germany", 1926),
    ("Audi", "German premium automaker known for Quattro all-wheel drive.", "Germany", 1909),
    ("Kia", "South Korean automaker with stylish, value-packed vehicles.", "South Korea", 1944),
    ("Toyota", "Japanese automaker, world leader in hybrid technology.", "Japan", 1937),
]

MODELS = {
    "NISSAN": [("Pathfinder", "SUV", 2023), ("Qashqai", "SUV", 2023), ("XTRAIL", "SUV", 2023)],
    "Mercedes": [("A-Class", "SUV", 2023), ("C-Class", "SUV", 2023), ("E-Class", "SUV", 2023)],
    "Audi": [("A4", "Sedan", 2023), ("A5", "Coupe", 2023), ("A6", "Sedan", 2023)],
    "Kia": [("Sorrento", "SUV", 2023), ("Carnival", "SUV", 2023), ("Cerato", "Sedan", 2023)],
    "Toyota": [("Camry", "Sedan", 2023), ("Corolla", "Sedan", 2023), ("RAV4", "SUV", 2023)],
}


def initiate():
    if CarMake.objects.exists():
        return
    for name, description, country, founded in MAKES:
        make = CarMake.objects.create(
            name=name, description=description, country=country, founded_year=founded
        )
        for model_name, car_type, year in MODELS[name]:
            CarModel.objects.create(
                car_make=make, name=model_name, type=car_type, year=year, dealer_id=1
            )
