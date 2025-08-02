import axios from 'axios';

const API_KEY = '62IyJXfIGpfy7NkzCJju2CrqTm0TzPapfpotILeL'; 

const cohere = axios.create({
  baseURL: 'https://api.cohere.ai/v1',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// 1. Generate full blog content
export const generateContent = async (title) => {
  try {
    const response = await cohere.post('/generate', {
      model: 'command-r-plus',
      prompt: `Write a blog post about "${title}" in an engaging, informative tone.`,
      max_tokens: 300,
      temperature: 0.8,
    });
    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error('Cohere API Error:', err);
    return 'AI content generation failed. Please try again.';
  }
};
export const generateTags = async (title, content) => {
  try {
    const response = await cohere.post('/generate', {
      model: 'command-r-plus',
      prompt: `Suggest 5 relevant, SEO-friendly tags (comma-separated) for a blog titled "${title}" with this content:\n${content}`,
      max_tokens: 60,
      temperature: 0.7,
    });
    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error('Cohere Tag Generation Error:', err);
    return 'Tag generation failed.';
  }
};


export const summarizeContent = async (content) => {
  try {
    const response = await cohere.post('/generate', {
      model: 'command-r-plus',
      prompt: `Summarize the following blog post in 2-3 concise sentences:\n${content}`,
      max_tokens: 100,
      temperature: 0.6,
    });
    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error('Summarize Error:', err);
    return 'Summarization failed.';
  }
};


export const rewriteTone = async (content) => {
  try {
    const response = await cohere.post('/generate', {
      model: 'command-r-plus',
      prompt: `Rewrite the following blog post in a professional tone:\n${content}`,
      max_tokens: 300,
      temperature: 0.7,
    });
    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error('Tone Rewrite Error:', err);
    return 'Tone rewrite failed.';
  }
};


export const optimizeSEO = async (title, content) => {
  try {
    const response = await cohere.post('/generate', {
      model: 'command-r-plus',
      prompt: `Suggest a more SEO-friendly title and meta description for this blog titled "${title}" with content:\n${content}`,
      max_tokens: 100,
      temperature: 0.7,
    });
    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error('SEO Optimization Error:', err);
    return 'SEO suggestion failed.';
  }
};
