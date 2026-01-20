"""
InterviewPilot - RAG Document Loader

Production-grade document loading with support for multiple formats,
metadata extraction, and error handling.
"""

import logging
from pathlib import Path
from typing import Optional

from langchain_core.documents import Document

logger = logging.getLogger(__name__)


class DocumentLoader:
    """
    Multi-format document loader for interview knowledge base.
    
    Supports:
    - Markdown (.md)
    - Plain text (.txt)  
    - PDF (.pdf) - requires pypdf
    """

    SUPPORTED_EXTENSIONS = {".md", ".txt", ".pdf"}

    def __init__(self, base_path: Optional[Path] = None):
        """
        Initialize the document loader.
        
        Args:
            base_path: Base directory for relative path resolution
        """
        self.base_path = base_path or Path("./knowledge")

    def load_file(self, file_path: Path) -> list[Document]:
        """
        Load a single file and return documents.
        
        Args:
            file_path: Path to the file to load
            
        Returns:
            List of Document objects with content and metadata
        """
        path = self._resolve_path(file_path)
        
        if not path.exists():
            logger.error(f"File not found: {path}")
            return []
            
        extension = path.suffix.lower()
        
        if extension not in self.SUPPORTED_EXTENSIONS:
            logger.warning(f"Unsupported file type: {extension}")
            return []

        try:
            if extension == ".pdf":
                return self._load_pdf(path)
            else:
                return self._load_text(path)
        except Exception as e:
            logger.error(f"Error loading {path}: {e}")
            return []

    def load_directory(
        self,
        directory: Optional[Path] = None,
        recursive: bool = True,
    ) -> list[Document]:
        """
        Load all supported files from a directory.
        
        Args:
            directory: Directory to scan (defaults to base_path)
            recursive: Whether to scan subdirectories
            
        Returns:
            List of all loaded documents
        """
        target_dir = self._resolve_path(directory) if directory else self.base_path
        
        if not target_dir.is_dir():
            logger.error(f"Not a directory: {target_dir}")
            return []

        documents: list[Document] = []
        pattern = "**/*" if recursive else "*"
        
        for ext in self.SUPPORTED_EXTENSIONS:
            for file_path in target_dir.glob(f"{pattern}{ext}"):
                docs = self.load_file(file_path)
                documents.extend(docs)
                
        logger.info(f"Loaded {len(documents)} documents from {target_dir}")
        return documents

    def _resolve_path(self, path: Path) -> Path:
        """Resolve path relative to base_path if not absolute."""
        if path.is_absolute():
            return path
        return self.base_path / path

    def _load_text(self, path: Path) -> list[Document]:
        """Load text/markdown file."""
        content = path.read_text(encoding="utf-8")
        
        metadata = {
            "source": str(path),
            "filename": path.name,
            "category": self._extract_category(path),
            "file_type": path.suffix.lower(),
        }
        
        return [Document(page_content=content, metadata=metadata)]

    def _load_pdf(self, path: Path) -> list[Document]:
        """Load PDF file using pypdf."""
        try:
            from pypdf import PdfReader
        except ImportError:
            logger.error("pypdf not installed. Run: pip install pypdf")
            return []

        reader = PdfReader(path)
        documents: list[Document] = []
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text.strip():
                metadata = {
                    "source": str(path),
                    "filename": path.name,
                    "category": self._extract_category(path),
                    "file_type": ".pdf",
                    "page": i + 1,
                }
                documents.append(Document(page_content=text, metadata=metadata))
                
        return documents

    def _extract_category(self, path: Path) -> str:
        """Extract category from directory structure."""
        try:
            relative = path.relative_to(self.base_path)
            parts = relative.parts
            if len(parts) > 1:
                return parts[0]
        except ValueError:
            pass
        return "general"
