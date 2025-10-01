"""Test OpenAI integration with a simple 'Hello' prompt."""
from adp_core.ai_clients.openai_client import OpenAIClient


def test_simple_hello_prompt():
    """Test that OpenAI responds to a simple 'Hello' prompt."""
    # Initialize the client
    client = OpenAIClient()

    # Send the Hello prompt
    response = client.prompt("Hello")

    # Verify we get a non-empty response
    assert response is not None
    assert len(response) > 0
    assert isinstance(response, str)

    # Print the response for verification
    print(f"\nOpenAI Response: {response}")


if __name__ == "__main__":
    # Run the test directly
    test_simple_hello_prompt()