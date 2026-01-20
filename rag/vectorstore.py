"""
InterviewPilot - Vector Store Manager

Production-grade ChromaDB integration with collection management,
document operations, and intelligent caching.
"""

import logging
from pathlib import Path
from typing import Optional

import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings

logger = logging.getLogger(__name__)


class VectorStoreManager:
    """
    Manages ChromaDB vector store operations.
    
    Features:
    - Persistent local storage
    - Collection management
    - Batch document operations
    - Metadata filtering support
    """

    DEFAULT_COLLECTION = "interview_knowledge"

    def __init__(
        self,
        persist_directory: str = "./data/chroma",
        embedding_model: str = "text-embedding-3-small",
        collection_name: Optional[str] = None,
    ):
        """
        Initialize the vector store manager.
        
        Args:
            persist_directory: Directory for ChromaDB persistence
            embedding_model: OpenAI embedding model name
            collection_name: Name of the collection to use
        """
        self.persist_directory = Path(persist_directory)
        self.collection_name = collection_name or self.DEFAULT_COLLECTION
        
        # Ensure directory exists
        self.persist_directory.mkdir(parents=True, exist_ok=True)
        
        # Initialize embeddings
        self._embeddings = OpenAIEmbeddings(model=embedding_model)
        
        # Initialize ChromaDB client
        self._client = chromadb.PersistentClient(
            path=str(self.persist_directory),
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True,
            ),
        )
        
        # Initialize LangChain Chroma wrapper
        self._vectorstore: Optional[Chroma] = None

    @property
    def vectorstore(self) -> Chroma:
        """Get or create the vector store instance."""
        if self._vectorstore is None:
            self._vectorstore = Chroma(
                client=self._client,
                collection_name=self.collection_name,
                embedding_function=self._embeddings,
            )
        return self._vectorstore

    def add_documents(
        self,
        documents: list[Document],
        batch_size: int = 100,
    ) -> list[str]:
        """
        Add documents to the vector store.
        
        Args:
            documents: Documents to add
            batch_size: Number of documents per batch
            
        Returns:
            List of document IDs
        """
        if not documents:
            logger.warning("No documents to add")
            return []

        all_ids: list[str] = []
        
        # Process in batches to avoid memory issues
        for i in range(0, len(documents), batch_size):
            batch = documents[i : i + batch_size]
            ids = self.vectorstore.add_documents(batch)
            all_ids.extend(ids)
            logger.debug(f"Added batch {i // batch_size + 1}: {len(batch)} documents")
            
        logger.info(f"Added {len(all_ids)} documents to collection '{self.collection_name}'")
        return all_ids

    def similarity_search(
        self,
        query: str,
        k: int = 4,
        filter_dict: Optional[dict] = None,
    ) -> list[Document]:
        """
        Search for similar documents.
        
        Args:
            query: Search query
            k: Number of results to return
            filter_dict: Optional metadata filter
            
        Returns:
            List of similar documents
        """
        return self.vectorstore.similarity_search(
            query=query,
            k=k,
            filter=filter_dict,
        )

    def similarity_search_with_score(
        self,
        query: str,
        k: int = 4,
        filter_dict: Optional[dict] = None,
    ) -> list[tuple[Document, float]]:
        """
        Search with relevance scores.
        
        Args:
            query: Search query
            k: Number of results
            filter_dict: Optional metadata filter
            
        Returns:
            List of (document, score) tuples
        """
        return self.vectorstore.similarity_search_with_score(
            query=query,
            k=k,
            filter=filter_dict,
        )

    def get_collection_stats(self) -> dict:
        """Get statistics about the current collection."""
        collection = self._client.get_collection(self.collection_name)
        return {
            "name": self.collection_name,
            "count": collection.count(),
            "persist_directory": str(self.persist_directory),
        }

    def delete_collection(self) -> None:
        """Delete the current collection."""
        self._client.delete_collection(self.collection_name)
        self._vectorstore = None
        logger.info(f"Deleted collection '{self.collection_name}'")

    def reset(self) -> None:
        """Reset the entire database."""
        self._client.reset()
        self._vectorstore = None
        logger.info("Reset ChromaDB")
