var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/diagnose', async function(req, res) {
	const { userPrompt } = req.body;

	const AiPrompt = `This is a promt that the user has given. The user has sent in a code problem/error. Help the user solve their problem/explain it to them to try and overcome their problem. If the user sends in something that is not an error inform them that that is not an error. Here is the users prompt: ${userPrompt}`

	const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: 'llama-3.1-8b-instant',
			messages: [{ role: 'user', content: AiPrompt }],
			max_tokens: 300
		})
	});

	const data = await response.json();
	const aiResponse = data.choices?.[0]?.message?.content || "Couldn't generate a response";

	res.redirect(`/answer?result=${encodeURIComponent(aiResponse)}`);
});

router.get('/answer', function(req, res) {
	const result = req.query.result;
	res.render('answer', { result });
});

module.exports = router;