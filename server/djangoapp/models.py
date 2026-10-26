from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.timezone import now


class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    country = models.CharField(max_length=100, blank=True, default="")
    founded_year = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    # Many-to-one: many car models belong to one car make
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    dealer_id = models.IntegerField(default=0)
    name = models.CharField(max_length=100)

    SEDAN = "Sedan"
    SUV = "SUV"
    WAGON = "WAGON"
    TRUCK = "Truck"
    COUPE = "Coupe"
    CAR_TYPES = [
        (SEDAN, "Sedan"),
        (SUV, "SUV"),
        (WAGON, "Wagon"),
        (TRUCK, "Truck"),
        (COUPE, "Coupe"),
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default=SEDAN)
    year = models.IntegerField(
        default=2023,
        validators=[MaxValueValidator(2025), MinValueValidator(2015)],
    )
    created_at = models.DateTimeField(default=now, editable=False)

    def __str__(self):
        return f"{self.car_make.name} {self.name}"
