from django.utils.translation import gettext_lazy as _
from rest_framework import permissions

from .models import User

class CanListAssignableUsers(permissions.BasePermission):
    message = _("No tienes permiso para esta acción.")

    _ALLOWED_PERMISSIONS = (
        User.Role.SUPERADMIN,
        User.Role.ADMINISTRATOR,
        User.Role.TUTOR,
        User.Role.COORDINATOR,
        User.Role.DIRECCION,
        User.Role.STUDENT
    )

    def has_permission(self, request, view):
        u = request.user 
        return bool(u and u.is_authenticated and u.role in self._ALLOWED_PERMISSIONS)


class IsAdminRole(permissions.BasePermission):

    message = _("No tienes permiso para esta acción.")

    def has_permission(self,request,view) -> bool:
        u = request.user 
        return bool(
            u 
            and u.is_authenticated
            and u.role in (User.Role.SUPERADMIN,User.Role.ADMINISTRATOR)
        )

    def has_object_permission(self,request,view,obj) -> bool:
        return self.has_permission(request,view)


class IsSelf(permissions.BasePermission):
    message = _("No tienes permiso para esta acción.")

    def has_permission(self,request,view) -> bool:
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self,request,view,obj) -> bool:
        return obj.pk == request.user.pk 