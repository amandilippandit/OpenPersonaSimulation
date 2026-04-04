import logging
logger = logging.getLogger("openpersona")

from openpersona import utils, config_manager

# We'll use various configuration elements below
config = utils.read_config_file()


###########################################################################
# Exposed API
###########################################################################
from .persona_factory import PersonaFactory

__all__ = ["PersonaFactory"]