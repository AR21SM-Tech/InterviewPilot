"""
InterviewPilot - Response Evaluator

Multi-dimensional evaluation of candidate responses with
scoring, feedback generation, and session analytics.
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from openai import OpenAI

from .prompts import get_evaluation_prompt

logger = logging.getLogger(__name__)


@dataclass
class ResponseScore:
    """Score for a single response."""
    
    overall: int  # 1-10
    strengths: list[str] = field(default_factory=list)
    improvements: list[str] = field(default_factory=list)
    raw_feedback: str = ""


@dataclass
class SessionMetrics:
    """Aggregated metrics for an interview session."""
    
    session_id: str
    interview_type: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    
    total_questions: int = 0
    questions_answered: int = 0
    average_score: float = 0.0
    scores: list[ResponseScore] = field(default_factory=list)
    
    # Timing metrics
    total_speaking_time_seconds: float = 0.0
    average_response_time_seconds: float = 0.0
    
    def add_score(self, score: ResponseScore) -> None:
        """Add a score and update aggregates."""
        self.scores.append(score)
        self.questions_answered += 1
        
        # Recalculate average
        total = sum(s.overall for s in self.scores)
        self.average_score = total / len(self.scores)
    
    def to_summary(self) -> dict:
        """Generate session summary."""
        return {
            "session_id": self.session_id,
            "interview_type": self.interview_type,
            "duration_minutes": self._duration_minutes(),
            "questions_answered": self.questions_answered,
            "average_score": round(self.average_score, 1),
            "score_trend": self._score_trend(),
            "top_strengths": self._aggregate_feedback("strengths"),
            "areas_to_improve": self._aggregate_feedback("improvements"),
        }
    
    def _duration_minutes(self) -> float:
        """Calculate session duration in minutes."""
        if not self.ended_at:
            return 0.0
        delta = self.ended_at - self.started_at
        return round(delta.total_seconds() / 60, 1)
    
    def _score_trend(self) -> str:
        """Determine if scores are improving, declining, or stable."""
        if len(self.scores) < 3:
            return "not_enough_data"
        
        first_half = self.scores[: len(self.scores) // 2]
        second_half = self.scores[len(self.scores) // 2 :]
        
        first_avg = sum(s.overall for s in first_half) / len(first_half)
        second_avg = sum(s.overall for s in second_half) / len(second_half)
        
        diff = second_avg - first_avg
        if diff > 0.5:
            return "improving"
        elif diff < -0.5:
            return "declining"
        return "stable"
    
    def _aggregate_feedback(self, field_name: str) -> list[str]:
        """Aggregate feedback across all responses."""
        all_items: list[str] = []
        for score in self.scores:
            items = getattr(score, field_name, [])
            all_items.extend(items)
        
        # Return unique items, preserving order
        seen = set()
        unique = []
        for item in all_items:
            if item not in seen:
                seen.add(item)
                unique.append(item)
        
        return unique[:5]  # Top 5 most common


class ResponseEvaluator:
    """
    Evaluates candidate responses using LLM-based analysis.
    
    Features:
    - Multi-dimensional scoring
    - Real-time feedback generation
    - Session-level analytics
    """
    
    def __init__(self, openai_client: Optional[OpenAI] = None):
        """
        Initialize the evaluator.
        
        Args:
            openai_client: Optional OpenAI client (creates one if not provided)
        """
        self._client = openai_client or OpenAI()
        self._sessions: dict[str, SessionMetrics] = {}
    
    def start_session(
        self,
        session_id: str,
        interview_type: str,
    ) -> SessionMetrics:
        """Start a new evaluation session."""
        metrics = SessionMetrics(
            session_id=session_id,
            interview_type=interview_type,
            started_at=datetime.now(),
        )
        self._sessions[session_id] = metrics
        logger.info(f"Started evaluation session: {session_id}")
        return metrics
    
    def end_session(self, session_id: str) -> Optional[SessionMetrics]:
        """End a session and return final metrics."""
        if session_id not in self._sessions:
            return None
        
        session = self._sessions[session_id]
        session.ended_at = datetime.now()
        logger.info(f"Ended session {session_id}: avg score {session.average_score:.1f}")
        return session
    
    def evaluate_response(
        self,
        session_id: str,
        question: str,
        response: str,
    ) -> ResponseScore:
        """
        Evaluate a single candidate response.
        
        Args:
            session_id: Current session ID
            question: The interview question
            response: Candidate's response
            
        Returns:
            ResponseScore with detailed feedback
        """
        # Generate evaluation using LLM
        evaluation = self._generate_evaluation(question, response)
        score = self._parse_evaluation(evaluation)
        
        # Update session metrics
        if session_id in self._sessions:
            self._sessions[session_id].add_score(score)
        
        return score
    
    def get_session(self, session_id: str) -> Optional[SessionMetrics]:
        """Get session metrics by ID."""
        return self._sessions.get(session_id)
    
    def _generate_evaluation(self, question: str, response: str) -> str:
        """Generate LLM-based evaluation."""
        try:
            completion = self._client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": get_evaluation_prompt()},
                    {
                        "role": "user",
                        "content": f"Question: {question}\n\nCandidate Response: {response}",
                    },
                ],
                max_tokens=200,
                temperature=0.3,
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"Evaluation failed: {e}")
            return "Unable to evaluate response."
    
    def _parse_evaluation(self, evaluation: str) -> ResponseScore:
        """Parse LLM evaluation into structured score."""
        # Simple parsing - extract score and feedback
        score = 7  # Default
        strengths: list[str] = []
        improvements: list[str] = []
        
        lines = evaluation.split("\n")
        for line in lines:
            line_lower = line.lower()
            
            # Extract numeric score
            if "score" in line_lower or "/10" in line:
                for word in line.split():
                    try:
                        num = int(word.strip("():/"))
                        if 1 <= num <= 10:
                            score = num
                            break
                    except ValueError:
                        continue
            
            # Extract strengths
            if "strength" in line_lower and ":" in line:
                content = line.split(":", 1)[1].strip()
                if content:
                    strengths.append(content)
            
            # Extract improvements
            if any(word in line_lower for word in ["improve", "suggestion", "consider"]):
                if ":" in line:
                    content = line.split(":", 1)[1].strip()
                    if content:
                        improvements.append(content)
        
        return ResponseScore(
            overall=score,
            strengths=strengths,
            improvements=improvements,
            raw_feedback=evaluation,
        )
