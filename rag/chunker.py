"""
InterviewPilot - Semantic Text Chunker

Production-grade text chunking with semantic awareness for optimal
RAG retrieval performance.
"""

import logging
from typing import Optional

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)


class SemanticChunker:
    """
    Semantic-aware text chunker optimized for interview content.
    
    Features:
    - Recursive splitting respecting document structure
    - Configurable chunk size and overlap
    - Metadata preservation and enhancement
    - Special handling for Q&A pairs
    """

    # Separators ordered by priority (most preferred first)
    DEFAULT_SEPARATORS = [
        "\n## ",      # H2 headers (new topic)
        "\n### ",     # H3 headers (subtopic)
        "\n\n",       # Paragraph breaks
        "\n- ",       # List items
        "\n* ",       # Alternative list items
        "\n",         # Line breaks
        ". ",         # Sentences
        " ",          # Words
        "",           # Characters (last resort)
    ]

    def __init__(
        self,
        chunk_size: int = 512,
        chunk_overlap: int = 50,
        separators: Optional[list[str]] = None,
    ):
        """
        Initialize the chunker.
        
        Args:
            chunk_size: Target size of each chunk in characters
            chunk_overlap: Overlap between consecutive chunks
            separators: Custom separator hierarchy
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or self.DEFAULT_SEPARATORS

        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=self.separators,
            length_function=len,
            is_separator_regex=False,
            keep_separator=True,
        )

    def chunk_documents(self, documents: list[Document]) -> list[Document]:
        """
        Split documents into semantically coherent chunks.
        
        Args:
            documents: List of documents to chunk
            
        Returns:
            List of chunked documents with enhanced metadata
        """
        if not documents:
            return []

        chunked_docs: list[Document] = []
        
        for doc in documents:
            chunks = self._chunk_single_document(doc)
            chunked_docs.extend(chunks)
            
        logger.info(
            f"Chunked {len(documents)} documents into {len(chunked_docs)} chunks"
        )
        return chunked_docs

    def _chunk_single_document(self, document: Document) -> list[Document]:
        """Process a single document into chunks."""
        content = document.page_content
        
        # Skip very short documents
        if len(content) <= self.chunk_size:
            return [self._enhance_metadata(document, 0, 1)]
        
        # Split the document
        chunks = self._splitter.split_text(content)
        
        # Create documents with enhanced metadata
        chunked_docs: list[Document] = []
        for i, chunk_text in enumerate(chunks):
            chunk_doc = Document(
                page_content=chunk_text.strip(),
                metadata=document.metadata.copy(),
            )
            enhanced_doc = self._enhance_metadata(chunk_doc, i, len(chunks))
            chunked_docs.append(enhanced_doc)
            
        return chunked_docs

    def _enhance_metadata(
        self,
        document: Document,
        chunk_index: int,
        total_chunks: int,
    ) -> Document:
        """Add chunk-specific metadata."""
        document.metadata.update({
            "chunk_index": chunk_index,
            "total_chunks": total_chunks,
            "chunk_size": len(document.page_content),
            "is_first_chunk": chunk_index == 0,
            "is_last_chunk": chunk_index == total_chunks - 1,
        })
        
        # Extract potential question from content
        content = document.page_content
        if content.startswith("Q:") or content.startswith("**Q:"):
            document.metadata["content_type"] = "qa_pair"
        elif content.startswith("#"):
            document.metadata["content_type"] = "heading"
        else:
            document.metadata["content_type"] = "text"
            
        return document


def create_chunker(chunk_size: int = 512, chunk_overlap: int = 50) -> SemanticChunker:
    """Factory function to create a configured chunker."""
    return SemanticChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
