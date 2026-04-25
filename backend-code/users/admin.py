from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import UserProfile

User = get_user_model()


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0
    fk_name = "user"


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        user = self.get_object(request, object_id)
        if user is not None:
            UserProfile.objects.get_or_create(user=user)
        return super().change_view(request, object_id, form_url, extra_context)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "university", "phone_number", "updated_at")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "university",
        "phone_number",
    )
