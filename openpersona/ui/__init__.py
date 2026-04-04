"""
OpenPersona UI Module

This module provides user interface components and widgets for OpenPersona,
enabling interactive experiences with OpenPersona agents and environments.

The module is organized into different sub-modules based on the UI framework:

- jupyter_widgets: Interactive widgets for Jupyter notebooks
- web: Web-based interfaces (future)
- cli: Command-line interfaces (future)

Example usage:
    from openpersona.ui.jupyter_widgets import AgentChatJupyterWidget
    
    # Create a chat interface with your agents
    chat = AgentChatJupyterWidget(agents)
    chat.display()
"""

from .jupyter_widgets import AgentChatJupyterWidget

__all__ = ['AgentChatJupyterWidget']
