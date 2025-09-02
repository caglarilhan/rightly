"""
Lightweight services package initializer.

Avoid importing submodules here to prevent side-effect imports during package import
(e.g., when using `from app.services import ...`). Modules can be imported lazily
by their consumers (e.g., `from app.services.r2 import presign_get_url`).
"""

__all__ = []
