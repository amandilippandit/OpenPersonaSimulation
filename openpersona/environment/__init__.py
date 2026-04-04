"""
Environments provide a structured way to define the world in which the
agents interact with each other as well as external entities (e.g., search engines).
"""

import logging
logger = logging.getLogger("openpersona")

###########################################################################
# Exposed API
###########################################################################
from openpersona.environment.world import World
from openpersona.environment.social_network import SocialNetwork

__all__ = ["World", "SocialNetwork"]