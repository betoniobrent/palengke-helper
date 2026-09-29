import importlib.util
import os
from pathlib import Path
import unittest
from types import SimpleNamespace
from unittest.mock import patch

os.environ['GROQ_API_KEY'] = 'test-only-not-a-real-key'
os.environ['GROQ_MODEL'] = 'openai/gpt-oss-20b'
spec = importlib.util.spec_from_file_location('backend', Path(__file__).parents[1] / 'replit/bo_sar_backend_groq.py')
backend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend)

class ChatTests(unittest.TestCase):
    def setUp(self):
        backend.threads.clear()
        self.api = backend.app.test_client()

    def test_history_keeps_plain_turns_and_latest_context(self):
        answer = SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content='Cook munggo.'))])
        with patch.object(backend.client.chat.completions, 'create', return_value=answer) as call:
            first = self.api.post('/chat', json={'message':'Suggest a dish', 'context':'OLD PRICE'}).get_json()
            result = self.api.post('/chat', json={'message':'For four people', 'context':'NEW PRICE', 'thread_id':first['thread_id']})
            self.assertEqual(result.status_code, 200)
            request = call.call_args.kwargs
            self.assertEqual(request['model'], 'openai/gpt-oss-20b')
            self.assertNotIn('OLD PRICE', str(request['messages']))
            self.assertIn('NEW PRICE', str(request['messages']))
            self.assertNotIn('PRICE', str(backend.threads))

    def test_failure_is_not_stored_and_rate_limit_is_clear(self):
        failure = RuntimeError('private provider details')
        failure.status_code = 429
        with patch.object(backend.client.chat.completions, 'create', side_effect=failure):
            result = self.api.post('/chat', json={'message':'Hello'})
            self.assertEqual(result.status_code, 429)
            self.assertIn('free usage limit', result.get_json()['error'])
            self.assertNotIn('private', result.get_data(as_text=True))
            self.assertEqual(backend.threads, {})

    def test_invalid_and_oversized_requests_do_not_call_provider(self):
        with patch.object(backend.client.chat.completions, 'create') as call:
            for payload in [[], {'message':123}, {'message':'x'*1001}, {'message':'Hi','context':'x'*6501}, {'message':'Hi','thread_id':[]}]:
                self.assertEqual(self.api.post('/chat', json=payload).status_code, 400)
            call.assert_not_called()

if __name__ == '__main__':
    unittest.main()
