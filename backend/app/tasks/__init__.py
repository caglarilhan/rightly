# Tasks package aggregator
from .ops import discover, package, erase  # noqa: F401

__all__ = [
    "discover",
    "package",
    "erase",
]
