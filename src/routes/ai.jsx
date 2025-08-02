const express = require('express');
const router = express.Router();
const cohere = require('cohere-ai');

cohere.init('YOUR_COHERE_API_KEY'); // Replace this

router.post('/summarize', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `Summarize this article in 2 sentences:\n\n${text}`,
      max_tokens: 100,
      temperature: 0.5,
    });

    res.json({ summary: response.body.generations[0].text });
  } catch (err) {
    console.error('Cohere error:', err);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

module.exports = router;
