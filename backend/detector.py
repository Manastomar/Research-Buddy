import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


def detect(user_text):
    """Analyzes text for plagiarism, originality, and common phrases."""
    if not user_text or not user_text.strip():
        return ""

    prompt = f"""You are an expert Plagiarism and Originality Checker.
Analyze the following text for plagiarism, originality, and matching phrases.

Text to analyze:
\"\"\"{user_text.strip()}\"\"\"

Please provide your analysis in this exact format:
1. Originality Score: [Calculate a score like 92% Original / 8% Similar]
2. Plagiarism Risk: [Low or Moderate or High]
3. Matched / Common Phrases: [List any matched or cliché phrases, or 'None detected']
4. Analysis & Suggestions:
   - Brief assessment of originality.
   - Quick recommendations.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
        return response.text
    except Exception:
        # Fallback to secondary model if primary is unavailable
        try:
            backup_response = client.models.generate_content(
                model="gemma-4-26b-a4b-it",
                contents=prompt
            )
            return backup_response.text
        except Exception as err:
            return f"Error: Could not check plagiarism ({err})"


if __name__ == "__main__":
    sample = "To be or not to be, that is the question."
    print(detect(sample))
