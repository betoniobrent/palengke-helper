import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
ASSISTANT_ID = os.environ.get("OPENAI_ASSISTANT_ID")
ASSISTANT_NAME = "Bo Sar - Palengke Helper"
ASSISTANT_INSTRUCTIONS = """You are Bo Sar, a wise and practical Filipino market-shopping and meal-planning assistant embedded in Palengke Helper+.

You help families:
- Build tipid (budget-friendly) weekly meal plans using Filipino dishes
- Estimate palengke costs using current market prices
- Suggest substitutes when an ingredient is expensive
- Give palengke shopping advice (tawad tips, best times, seasonal produce)
- Answer cooking questions for Filipino recipes

Speak naturally in English and Tagalog. Be concise, warm, and actionable."""


def get_or_create_assistant():
    if ASSISTANT_ID:
        try:
            return client.beta.assistants.retrieve(ASSISTANT_ID)
        except Exception:
            pass
    return client.beta.assistants.create(
        name=ASSISTANT_NAME,
        instructions=ASSISTANT_INSTRUCTIONS,
        model="gpt-4o-mini",
    )


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    thread_id = data.get("thread_id")
    context = data.get("context", "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    try:
        assistant = get_or_create_assistant()

        if not thread_id:
            thread = client.beta.threads.create()
            thread_id = thread.id
        else:
            thread = client.beta.threads.retrieve(thread_id)

        full_message = message
        if context:
            full_message = f"Context:\n{context}\n\nQuestion:\n{message}"

        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=full_message,
        )

        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant.id,
        )

        while run.status in ["queued", "in_progress"]:
            run = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id,
            )

        if run.status != "completed":
            return jsonify({"error": f"Run failed with status {run.status}"}), 500

        messages = client.beta.threads.messages.list(thread_id=thread_id)
        last = messages.data[0]
        reply = last.content[0].text.value if last.content else ""

        return jsonify({
            "reply": reply,
            "thread_id": thread_id,
            "assistant_id": assistant.id,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
