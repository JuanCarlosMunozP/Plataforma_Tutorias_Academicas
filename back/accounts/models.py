from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import EmailValidator

from .managers import UserManager


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT",_("Estudiante")
        TUTOR = "TUTOR",_("Tutor")
        COORDINATOR = "COORDINATOR",_("Coordinador")
        SUPERADMIN = "SUPERADMINISTRATOR",_("Superadministrador")
        ADMINISTRATOR = "ADMINISTRATOR",_("Administrador")
        DIRECCION = "DIRECCION",_("Direccion")
        AUDITOR = "AUDITOR",_("Auditor")

    email = models.EmailField(
        _("Correo institucional"),
        max_length=50,
        unique=True,
        blank=False,
        db_index=True,
        validators=[EmailValidator(message="Please enter a valid email address.")]
    )
    document = models.CharField(
        _("Identificación institucional"),
        max_length=20,
        unique=True,
        blank=False,
        db_index=True
    )
    first_name = models.CharField(_("Nombres"),max_length=50,blank=True,db_index=True)
    last_name = models.CharField(_("Apellidos"),max_length=50,blank=True,db_index=True)
    role = models.CharField(_("Rol"),max_length=20,blank=True,db_index=True,choices=Role.choices)

    objects = UserManager()

    REQUIRED_FIELDS = ["email","first_name","last_name","role"]

    class Meta:
        verbose_name = _("Usuario")
        verbose_name = _("Usuarios")
        ordering = ["username"]
        indexes = [
            models.Index(fields=["role"],name="user_role_idx"),
            models.Index(fields=["is_active"],name="user_is_active_idx"),
            models.Index(fields=["email"],name="user_email_idx")
        ]

    
    def __str__(self) -> str:
        return f"{self.username} ({self.get_role_display()})" #type: ignore[attr-defined]
    

    @property
    def is_admin_role(self) -> bool:
        return self.role in {self.Role.ADMINISTRATOR,self.Role.SUPERADMIN}

    