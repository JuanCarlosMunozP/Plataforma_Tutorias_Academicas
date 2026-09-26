from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _
from pydantic import ValidationError
from rest_framework import serializers


from accounts.models import User


def _normalize_text(value:str) -> str:
    return " ".join(value.split()).strip()

def _normalize_email(value:str) -> str:
    return value.strip().lower()

def _normalize_username(value:str) -> str:
    return value.strip()

class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display",read_only=True)

    class Meta: 
        model = User
        fields = (
            "id",
            "username",
            "email",
            "document",
            "first_name",
            "last_name",
            "role",
            "role_display",
            "is_active",
            "date_joined"
            "last_login"
        )
        read_only_fields = ("id","role_display","date_joined","last_login")

class UserCreateSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display",read_only=True)
    password = serializers.CharField(write_only=True,required=True,min_length=8)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "document",
            "first_name",
            "last_name",
            "role",
            "role_display",
            "is_active",
            "password",
            "date_joined",
            "last_login"
        )
        read_only_fields = ("id","role_display","date_joined","last_login")

    def validate_username(self,value:str) -> str:
        normalized = _normalize_username(value)
        if not normalized:
            raise serializers.ValidationError(_("El nombre de usuario no puede estar vacío"))
        if User.objects.filter(username__iexact=normalized).exists():
            raise serializers.ValidationError(
                _("Ya existe un usuario con este nombre de usuario.")
            )
        return normalized

    def validate_email(self,value:str) -> str:
        normalized = _normalize_email(value)
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError(
                 _("Ya existe un usuario con este correo electrónico.")
            )
        return normalized

    def validate_last_name(self,value:str) -> str:
        normalized = _normalize_text(value)
        if not normalized:
            raise serializers.ValidationError(_("Los apellidos no pueden estar vacíos."))
        return normalized

    def validate_role(self,value:str) -> str:
        request = self.context.get("request")
        caller = getattr(request,"User",None)
        if value == User.Role.SUPERADMIN:
            if caller is None or caller.role != User.Role.SUPERADMIN:
                raise serializers.ValidationError(
                    _("Solo un superadministrador puede crear otro superadministrador.")
                )
        return value

    def validate_password(self,value:str) -> str:
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages)) from exc
        return value

    def create(self,validated_data):
        password = validated_data.pop("password")
        is_active = validated_data.pop("is_active",True)
        user = User.objects.create_user(password=password,**validated_data)
        if not is_active:
            user.is_active = False
            user.save(update_fields=["is_active"])
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display",read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "document",
            "first_name",
            "last_name",
            "role",
            "role_display",
            "date_joined",
            "last_login",
        )        
        read_only_fields = ("id","role_display","date_joined","last_login")

    def validate_username(self,value:str) -> str:
        normalized = _normalize_username(value)
        if not normalized:
            raise serializers.ValidationError(_("El nombre de usuario no puede estar vacío"))
        qs = User.objects.filter(username__iexact=normalized)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                _("Ya existe un usuario con este nombre de usuario.")
            )
        return normalized

    def validate_email(self,value:str) -> str:
        normalized = _normalize_email(value)
        qs = User.objects.filter(email__iexact=normalized)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                _("Ya existe un usuario con este correo.")
            )
        return normalized

    def validate_first_name(self,value:str) -> str:
        normalized = _normalize_text(value)
        if not normalized:
            raise serializers.ValidationError(_("Los nombres no pueden estar vacíos."))
        return normalized

    def validate_last_name(self,value:str) -> str:
        normalized = _normalize_text(value)
        if not normalized:
            raise serializers.ValidationError(_("Los apellidos no pueden estar vacíos."))
        return normalized

    def validate_role(self,value:str) -> str:
        request = self.context.get("request")
        caller = getattr(request,"user",None)
        target = self.instance
        is_superadmin_caller = caller is not None and caller.role == User.Role.SUPERADMIN

        promoting_to_superadmin = value == User.Role.SUPERADMIN
        demoting_existing_superadmin = (
            target is not None
            and target.role == User.Role.SUPERADMIN
            and value != User.Role.SUPERADMIN
        )

        if (promoting_to_superadmin or demoting_existing_superadmin) and not is_superadmin_caller:
            raise serializers.ValidationError(
                _("Solo un superadministrador puede asignar otro superadministrador.")
            )
        return value



        
