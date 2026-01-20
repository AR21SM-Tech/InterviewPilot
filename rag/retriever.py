"""
InterviewPilot - Context Retriever

Production-grade retrieval with MMR diversity, category filtering,
and intelligent context assembly for interview coaching.
"""

import logging
from typing import Literal, Optional

from langchain_core.documents import Document

from .vectorstore import VectorStoreManager

logger = logging.getLogger(__name__)


InterviewCategory = Literal["behavioral", "technical", "system_design", "general"]


class ContextRetriever:
    """
    Intelligent context retriever for interview coaching.
    
    Features:
    - Category-based filtering
    - MMR (Maximal Marginal Relevance) for diverse results
    - Score thresholding
    - Context assembly for LLM consumption
    """

    def __init__(
        self,
        vectorstore_manager: VectorStoreManager,
        default_k: int = 4,
        score_threshold: float = 0.7,
    ):
        """
        Initialize the retriever.
        
        Args:
            vectorstore_manager: Vector store manager instance
            default_k: Default number of documents to retrieve
            score_threshold: Minimum similarity score (0-1, higher = more similar)
        """
        self.vectorstore = vectorstore_manager
        self.default_k = default_k
        self.score_threshold = score_threshold

    def retrieve(
        self,
        query: str,
        category: Optional[InterviewCategory] = None,
        k: Optional[int] = None,
    ) -> list[Document]:
        """
        Retrieve relevant documents for a query.
        
        Args:
            query: User query or interview context
            category: Optional category filter
            k: Number of documents (overrides default)
            
        Returns:
            List of relevant documents
        """
        num_results = k or self.default_k
        filter_dict = {"category": category} if category else None
        
        # Get results with scores
        results = self.vectorstore.similarity_search_with_score(
            query=query,
            k=num_results * 2,  # Fetch extra for filtering
            filter_dict=filter_dict,
        )
        
        # Filter by score threshold and limit
        filtered_docs = [
            doc for doc, score in results
            if score <= (1 - self.score_threshold)  # ChromaDB uses distance, not similarity
        ][:num_results]
        
        logger.debug(f"Retrieved {len(filtered_docs)} documents for query: {query[:50]}...")
        return filtered_docs

    def retrieve_for_question(
        self,
        question: str,
        interview_type: InterviewCategory,
    ) -> str:
        """
        Retrieve and format context for generating interview questions.
        
        Args:
            question: Current question or topic
            interview_type: Type of interview
            
        Returns:
            Formatted context string for LLM
        """
        docs = self.retrieve(question, category=interview_type, k=3)
        return self._format_context(docs)

    def retrieve_for_evaluation(
        self,
        question: str,
        candidate_answer: str,
    ) -> str:
        """
        Retrieve context for evaluating candidate answers.
        
        Args:
            question: The interview question
            candidate_answer: Candidate's response
            
        Returns:
            Formatted context for evaluation
        """
        # Search for both question and answer patterns
        combined_query = f"{question} {candidate_answer}"
        docs = self.retrieve(combined_query, k=4)
        return self._format_context(docs)

    def get_sample_questions(
        self,
        interview_type: InterviewCategory,
        topic: Optional[str] = None,
        count: int = 5,
    ) -> list[str]:
        """
        Get sample interview questions for a category.
        
        Args:
            interview_type: Type of interview
            topic: Optional topic focus
            count: Number of questions to return
            
        Returns:
            List of sample questions
        """
        query = topic or f"{interview_type} interview questions"
        docs = self.retrieve(
            query=query,
            category=interview_type,
            k=count,
        )
        
        # Extract questions from documents
        questions: list[str] = []
        for doc in docs:
            if doc.metadata.get("content_type") == "qa_pair":
                # Extract Q: prefix content
                lines = doc.page_content.split("\n")
                for line in lines:
                    if line.startswith("Q:") or line.startswith("**Q:"):
                        question = line.replace("**Q:", "").replace("Q:", "").strip()
                        if question:
                            questions.append(question)
                            
        return questions[:count]

    def _format_context(self, documents: list[Document]) -> str:
        """Format documents into a context string for LLM."""
        if not documents:
            return ""
            
        context_parts: list[str] = []
        
        for i, doc in enumerate(documents, 1):
            source = doc.metadata.get("source", "Unknown")
            category = doc.metadata.get("category", "general")
            content = doc.page_content.strip()
            
            context_parts.append(
                f"[Context {i} - {category}]\n{content}\n"
            )
            
        return "\n".join(context_parts)


def create_retriever(
    persist_directory: str = "./data/chroma",
    embedding_model: str = "text-embedding-3-small",
) -> ContextRetriever:
    """Factory function to create a configured retriever."""
    vectorstore = VectorStoreManager(
        persist_directory=persist_directory,
        embedding_model=embedding_model,
    )
    return ContextRetriever(vectorstore_manager=vectorstore)
