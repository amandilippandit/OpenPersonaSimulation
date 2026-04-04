import pytest
import logging

logger = logging.getLogger("openpersona")

import sys
# Insert paths at the beginning of sys.path (position 0)
sys.path.insert(0, '..')
sys.path.insert(0, '../../')
sys.path.insert(0, '../../openpersona/')

import openpersona
from openpersona.agent import Persona, ToolUseFaculty
from openpersona.environment import World, SocialNetwork
from openpersona.factory import PersonaFactory
from openpersona.extraction import ResultsExtractor

from openpersona.enrichment import Enricher
from openpersona.extraction import ArtifactExporter
from openpersona.tools import DocWriter

from openpersona.examples import create_lisa_the_data_scientist, create_oscar_the_architect, create_marcos_the_physician
import openpersona.control as control
from openpersona.control import Simulation

from testing_utils import *


#@pytest.mark.timeout(300)
class TestBasicScenarios:

    @pytest.mark.core
    def test_basic_scenario_1(self):
        control.reset()

        assert control._current_simulations["default"] is None, "There should be no simulation running at this point."

        control.begin()
        assert control._current_simulations["default"].status == Simulation.STATUS_STARTED, "The simulation should be started at this point."

        agent = create_oscar_the_architect()

        agent.define("age", 19)
        agent.define("nationality", "Brazilian")

        assert control._current_simulations["default"].cached_trace is not None, "There should be a cached trace at this point."
        assert control._current_simulations["default"].execution_trace is not None, "There should be an execution trace at this point."

        control.checkpoint()
        # TODO check file creation

        agent.listen_and_act("How are you doing??")
        agent.define("occupation", "Engineer")

        control.checkpoint()
        # TODO check file creation

        control.end()

    @pytest.mark.core
    def test_tool_usage_1(self):

        data_export_folder = f"{EXPORT_BASE_FOLDER}/test_tool_usage_1"

        exporter = ArtifactExporter(base_output_folder=data_export_folder)
        enricher = Enricher()
        tooluse_faculty = ToolUseFaculty(tools=[DocWriter(exporter=exporter, enricher=enricher)])

        lisa = create_lisa_the_data_scientist()

        lisa.add_mental_faculties([tooluse_faculty])

        actions = lisa.listen_and_act(
            """
            You have just been fired and need to find a new job. You decide to think about what you 
            want in life and then write a resume. The file must be titled **exactly** 'Resume'.
            Don't stop until you actually write the resume.
            """,
            return_actions=True,
        )

        assert contains_action_type(actions, "WRITE_DOCUMENT"), "There should be a WRITE_DOCUMENT action in the actions list."

        # check that the document was written to a file
        assert os.path.exists(f"{data_export_folder}/Document/Resume.Lisa Carter.docx"), "The document should have been written to a file."
        assert os.path.exists(f"{data_export_folder}/Document/Resume.Lisa Carter.json"), "The document should have been written to a file."
        assert os.path.exists(f"{data_export_folder}/Document/Resume.Lisa Carter.md"), "The document should have been written to a file."
