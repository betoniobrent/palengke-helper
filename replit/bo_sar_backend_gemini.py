import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

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
        threads[thread_id] = []

    full_message = message
    if context:
        full_message = f"Context:\n{context}\n\nQuestion:\n{message}"

    threads[thread_id].append({"role": "user", "parts": [full_message]})

    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=ASSISTANT_INSTRUCTIONS
        )
        # Use previous messages as history, then send the latest message
        history = threads[thread_id][:-1]
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(threads[thread_id][-1]["parts"][0])
        reply = response.text
        threads[thread_id].append({"role": "model", "parts": [reply]})
        return jsonify({"reply": reply, "thread_id": thread_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
