import os
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

ASSISTANT_INSTRUCTIONS = """You are Bo Sar, a wise and practical Filipino market-shopping and meal-planning assistant embedded in Palengke Helper+.

You help families:
- Build tipid (budget-friendly) weekly meal plans using Filipino dishes
- Estimate palengke costs using current market prices
- Suggest substitutes when an ingredient is expensive
- Give palengke shopping advice (tawad tips, best times, seasonal produce)
- Answer cooking questions for Filipino recipes

Speak naturally in English and Tagalog. Be concise, warm, and actionable."""

# In-memory conversation store per thread
threads = {}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    thread_id = data.get("thread_id")
    context = data.get("context", "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    if not GOOGLE_API_KEY:
        return jsonify({"error": "GOOGLE_API_KEY environment variable is not set"}), 500

    if not thread_id:
        thread_id = os.urandom(16).hex()

    if thread_id not in threads:
        threads[thread_id] = []

    user_content = ASSISTANT_INSTRUCTIONS
    if context:
        user_content += f"\n\nContext:\n{context}"
    user_content += f"\n\nQuestion:\n{message}"

    threads[thread_id].append({"role": "user", "parts": [user_content]})

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        # Keep recent turns to stay within context limits
        contents = threads[thread_id][-10:]
        response = model.generate_content(contents=contents)
        reply = response.text
        threads[thread_id].append({"role": "model", "parts": [reply]})
        return jsonify({"reply": reply, "thread_id": thread_id})
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
