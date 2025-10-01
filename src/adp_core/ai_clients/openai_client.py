"""Simple OpenAI client for GPT-5 Nano integration."""
import os
from openai import OpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class AIResponse(BaseModel):
    """Structured AI response model."""
    content: str = Field(description="AI-generated text")
    model: str = Field(description="Model used")
    tokens_used: int = Field(default=0)


class OpenAIClient:
    """Simple OpenAI API client following ADP patterns."""

    def __init__(self, model: str = "gpt-5-nano"):
        """Initialize OpenAI client.

        Args:
            model: OpenAI model to use (default: gpt-5-nano)
        """
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")

        self.client = OpenAI(api_key=api_key)
        self.model = model

    def prompt(self, message: str) -> str:
        """Send a simple prompt to OpenAI and return response.

        Args:
            message: The prompt message to send

        Returns:
            The AI's text response
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": message}],
            max_tokens=1024,
            temperature=0.7
        )

        return response.choices[0].message.content