# InterviewPilot

A real-time voice-enabled AI interview coach designed to simulate high-stakes technical and behavioral interviews.

## Overview

InterviewPilot combines low-latency voice AI agents with Retrieval-Augmented Generation (RAG) to provide a realistic interview experience. Unlike standard chat-based assistants, InterviewPilot conducts full-duplex voice conversations, analyzes spoken responses for clarity and content, and provides real-time feedback based on industry-standard frameworks (STAR method for behavioral, System Design constraints, etc.).

## Architecture

The system is composed of two primary subsystems:

1.  **AI Agent (Backend)**: Built with Python and LiveKit Agents. It manages the conversational state, synthesizes speech, and orchestrates the RAG pipeline using LangChain and ChromaDB.
2.  **User Interface (Frontend)**: A Next.js application providing the interactive session environment, real-time transcription, and visual feedback mechanisms.

### Technology Stack

*   **Voice Pipeline**: LiveKit (WebRTC, Agents Framework)
*   **LLM & Speech**: OpenAI GPT-4o, Whisper, TTS
*   **Vector Database**: ChromaDB (Local/Server-side persistence)
*   **Frontend Framework**: Next.js 14, React 19, Tailwind CSS
*   **Authentication**: NextAuth.js (Google OAuth)

## Features

*   **Low-Latency Voice Interaction**: Supports near-instantaneous turn-taking and interruptions.
*   **Context-Aware Evaluation**: Evaluates answers against specific criteria (e.g., complexity in DSA problems).
*   **Adaptive Questioning**: Follow-up questions generated dynamically based on candidate responses.
*   **Visual Feedback Core**: Real-time audio visualization indicating agent state (listening, processing, speaking).

## Installation

### Prerequisites

*   Python 3.11 or higher
*   Node.js 18 or higher
*   LiveKit Cloud credentials
*   OpenAI API Key

### Backend Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/AR21SM-Tech/InterviewPilot.git
    cd InterviewPilot
    ```

2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows: venv\Scripts\activate
    # Linux/Mac: source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure environment variables in `.env` (refer to `.env.example`).

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Build the application:
    ```bash
    npm run build
    ```

## Development

To start the development environment:

1.  **Start the Agent**:
    ```bash
    python -m agent.main dev
    ```

2.  **Start the UI**:
    ```bash
    cd frontend
    npm run dev
    ```

Access the application at `http://localhost:3000`.

## License

This project is licensed under the MIT License.
