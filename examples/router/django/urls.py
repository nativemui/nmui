# Django urls.py — FRAGMENT: merge into your project's urlpatterns.
# The catch-all must be LAST, after admin and API routes.
# Assumes the built app is available as the "index.html" template
# (e.g. copied into a templates dir, or served via WhiteNoise with
# the same fallback view).
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    # …api routes…
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]
