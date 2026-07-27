import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL_NAME = os.environ.get("GROQ_MODEL", "gemma2-9b-it")

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

    if not thread_id:
        thread_id = os.urandom(16).hex()

    if thread_id not in threads:
        threads[thread_id] = [{"role": "system", "content": ASSISTANT_INSTRUCTIONS}]

    full_message = message
    if context:
        full_message = f"Context:\n{context}\n\nQuestion:\n{message}"

    threads[thread_id].append({"role": "user", "content": full_message})

    try:
        # Keep conversation from growing too large while preserving the system prompt
        history = threads[thread_id]
        recent = history if len(history) <= 6 else [history[0]] + history[-5:]
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=recent,
            max_tokens=400,
            temperature=0.7
        )
        reply = response.choices[0].message.content
        threads[thread_id].append({"role": "assistant", "content": reply})
        return jsonify({"reply": reply, "thread_id": thread_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
