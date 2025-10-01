"""Debug test for gpt-5-nano model to understand its behavior and requirements."""
import json
from adp_core.ai_clients.openai_client import OpenAIClient


def test_gpt5_nano_basic():
    """Test basic gpt-5-nano functionality with detailed error reporting."""

    print("\n" + "="*80)
    print("GPT-5-NANO DEBUG TEST")
    print("="*80)

    client = OpenAIClient()

    print(f"\n📋 Client Configuration:")
    print(f"  Model: {client.model}")
    print(f"  API Key: {'*' * 20}{client.client.api_key[-4:]}")

    # Test 1: Very simple prompt
    print("\n" + "-"*80)
    print("TEST 1: Simple greeting")
    print("-"*80)

    try:
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "user", "content": "Say hello"}
            ]
        )

        print(f"\n✅ Response received:")
        print(f"  ID: {response.id}")
        print(f"  Model: {response.model}")
        print(f"  Choices: {len(response.choices)}")

        if response.choices:
            choice = response.choices[0]
            print(f"  Finish Reason: {choice.finish_reason}")
            print(f"  Message Role: {choice.message.role}")
            print(f"  Message Content: '{choice.message.content}'")
            print(f"  Content Length: {len(choice.message.content) if choice.message.content else 0}")

        if hasattr(response, 'usage'):
            print(f"\n  Token Usage:")
            print(f"    Prompt: {response.usage.prompt_tokens}")
            print(f"    Completion: {response.usage.completion_tokens}")
            print(f"    Total: {response.usage.total_tokens}")

    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        if hasattr(e, 'response'):
            print(f"  Response: {e.response}")

    # Test 2: With system prompt
    print("\n" + "-"*80)
    print("TEST 2: With system prompt")
    print("-"*80)

    try:
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What is 2+2?"}
            ]
        )

        print(f"\n✅ Response received:")
        print(f"  Content: '{response.choices[0].message.content}'")

    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")

    # Test 3: With max_completion_tokens
    print("\n" + "-"*80)
    print("TEST 3: With max_completion_tokens parameter")
    print("-"*80)

    try:
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "user", "content": "Write a short sentence about music."}
            ],
        )

        print(f"\n✅ Response received:")
        print(f"  Content: '{response.choices[0].message.content}'")

    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")

    # Test 4: Check available parameters
    print("\n" + "-"*80)
    print("TEST 4: Testing parameter compatibility")
    print("-"*80)

    # Try with no optional parameters
    try:
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "user", "content": "Generate a creative music description in one sentence."}
            ]
        )

        print(f"\n✅ No optional params - Response:")
        print(f"  Content: '{response.choices[0].message.content}'")
        print(f"  Length: {len(response.choices[0].message.content) if response.choices[0].message.content else 0} chars")

    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")

    # Test 5: Full response object inspection
    print("\n" + "-"*80)
    print("TEST 5: Full API response inspection")
    print("-"*80)

    try:
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "user", "content": "Test"}
            ]
        )

        print(f"\n✅ Full response object:")
        # Convert to dict for inspection
        response_dict = response.model_dump()
        print(json.dumps(response_dict, indent=2, default=str))

    except Exception as e:
        print(f"\n❌ Error: {type(e).__name__}: {e}")
        import traceback
        print("\nFull traceback:")
        traceback.print_exc()

    print("\n" + "="*80)
    print("DEBUG TEST COMPLETED")
    print("="*80)


if __name__ == "__main__":
    test_gpt5_nano_basic()