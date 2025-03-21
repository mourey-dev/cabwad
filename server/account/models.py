from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
from datetime import datetime


class CustomUserManager(BaseUserManager):
    def create_user(self, email, birthdate, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not birthdate:
            raise ValueError("Birthdate is required")
        if "last_name" not in extra_fields:
            raise ValueError("Last name is required")

        email = self.normalize_email(email)
        extra_fields.setdefault("is_admin", False)

        # Convert birthdate to datetime if it's a string
        if isinstance(birthdate, str):
            birthdate = datetime.strptime(birthdate, "%Y-%m-%d")

        # Create username from lastname and birth year
        username = f"{extra_fields['last_name'].lower()}{birthdate.year}"
        extra_fields["username"] = username

        # Set password as birthdate (1990-03-15)
        password = birthdate.strftime("%Y-%m-%d")

        user = self.model(email=email, birthdate=birthdate, **extra_fields)
        user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(self, email, birthdate, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_admin", True)
        return self.create_user(email, birthdate, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    birthdate = models.DateField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["first_name", "last_name", "birthdate"]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def role(self):
        if self.is_superuser:
            return "Super Admin"
        elif self.is_admin:
            return "Admin"
        return None

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["last_name", "first_name"]
