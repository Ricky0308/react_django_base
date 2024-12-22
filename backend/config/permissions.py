from rest_framework import permissions

class IsUserItselfOrAdmin(permissions.BasePermission):
    
    def has_object_permission(self, request, view, target_user):
        if request.user.is_staff:
            return True
        return request.user.id == target_user.id
    
    def has_permission(self, request, view):
        return request.user.is_authenticated