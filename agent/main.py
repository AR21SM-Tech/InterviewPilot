"""
InterviewPilot - Interview Agent

Core LiveKit voice agent implementing the interview coaching logic
with RAG integration and intelligent conversation management.

Updated for livekit-agents 1.0+ API using AgentSession.
"""

import json
import logging
from typing import Optional

from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, RoomInputOptions, RunContext
from livekit.agents.llm import ChatContext, ChatMessage
from livekit.plugins import openai, silero

from .config import get_settings
from .evaluator import ResponseEvaluator
from .prompts import InterviewType, get_system_prompt

logger = logging.getLogger(__name__)


class InterviewAgent(Agent):
    """
    AI Interview Coach powered by LiveKit AgentSession.
    
    Features:
    - Real-time voice conversation
    - Interview type-specific prompts
    - RAG-augmented context
    - Response evaluation
    """
    
    def __init__(
        self,
        interview_type: InterviewType = "behavioral",
        candidate_info: str = "",
        context: str = "",
    ):
        """
        Initialize the interview agent.
        
        Args:
            interview_type: Type of interview to conduct
            candidate_info: Information about the candidate
            context: RAG-retrieved context
        """
        super().__init__(
            instructions=get_system_prompt(
                interview_type=interview_type,
                context=context,
                candidate_info=candidate_info,
            )
        )
        self.interview_type = interview_type
        self.candidate_info = candidate_info
        self.context = context
        self.settings = get_settings()
        
        # Initialize evaluator
        self.evaluator = ResponseEvaluator()
        
        # Session state
        self.session_id: Optional[str] = None
        self.current_question: Optional[str] = None
        self.question_count = 0


async def entrypoint(ctx: JobContext) -> None:
    """
    Main entrypoint for the LiveKit agent.
    
    This is called when a new room session starts.
    """
    logger.info(f"Connecting to room: {ctx.room.name}")
    
    # Extract interview configuration from room metadata
    interview_type: InterviewType = "behavioral"
    candidate_info = ""
    
    # Parse room metadata if available
    if ctx.room.metadata:
        try:
            metadata = json.loads(ctx.room.metadata)
            interview_type = metadata.get("interview_type", "behavioral")
            candidate_info = metadata.get("candidate_info", "")
        except json.JSONDecodeError:
            pass
    
    # Connect to the room
    await ctx.connect(auto_subscribe=agents.AutoSubscribe.AUDIO_ONLY)
    
    # Wait for participant
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")
    
    settings = get_settings()
    
    # Create the agent session with the new API
    session = AgentSession(
        vad=silero.VAD.load(),
        stt=openai.STT(),
        llm=openai.LLM(model=settings.openai_model),
        tts=openai.TTS(voice=settings.openai_tts_voice),
    )
    
    # Create interview agent
    interview_agent = InterviewAgent(
        interview_type=interview_type,
        candidate_info=candidate_info,
    )
    
    # Start the session
    await session.start(
        agent=interview_agent,
        room=ctx.room,
        participant=participant,
        room_input_options=RoomInputOptions(
            # Allow interruptions
            noise_cancellation=True,
        ),
    )
    
    # Initial greeting
    await session.say(
        "Hello! Welcome to InterviewPilot. I'm Alex, your AI interview coach. "
        "I'll be conducting your mock interview today. Are you ready to begin?",
        allow_interruptions=True,
    )


def main() -> None:
    """Main entry point for the agent."""
    agents.cli.run_app(
        agents.WorkerOptions(
            entrypoint_fnc=entrypoint,
        ),
    )


if __name__ == "__main__":
    main()
