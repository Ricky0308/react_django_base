from rest_framework import permissions


class IsAccessingOwnAccount(permissions.BasePermission):
    
    def has_object_permission(self, request, view, target_user):
        return request.user.id == target_user.id
    
    def has_permission(self, request, view):
        return request.user.is_authenticated