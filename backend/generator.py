import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


def generate(user_text):
    """Generates structured academic research content based on topic or keyword."""
    if not user_text or not user_text.strip():
        return ""

    prompt = f"""You are Research Buddy, an expert academic research assistant.
Generate a structured research report based on the following keyword or topic:

Topic / Keyword: "{user_text.strip()}"

Please structure the response clearly with the following research sections:

# Title: [A formal academic title]

## Abstract
[A concise overview of the topic, purpose, key arguments, and conclusions]

**Keywords:** [5-7 relevant research index terms]

## 1. Introduction
[Background context, significance of the topic, and primary research objectives]

## 2. Core Analysis & Key Findings
[In-depth breakdown, structured arguments, and key technical or theoretical concepts]

## 3. Discussion & Implications
[Impact, real-world applications, and future research directions]

## 4. Conclusion
[Summary of primary takeaways]
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )
        return response.text
    except Exception:
        # Fallback to secondary model if primary is unavailable
        try:
            backup_response = client.models.generate_content(
                model="gemma-4-31b-it",
                contents=prompt
            )
            return backup_response.text
        except Exception as err:
            return f"Error: Could not generate research content ({err})"


if __name__ == "__main__":
    test_topic = "Artificial Intelligence in Healthcare"
    print(generate(test_topic))
