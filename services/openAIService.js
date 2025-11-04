const OpenAI = require('openai');

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function getChatResponse(userMessage) {
  try {
    if (!openai) {
      return 'OpenAI service is not configured. Please set OPENAI_API_KEY environment variable.';
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful expense planner AI. Provide helpful, friendly, and clear responses for expense planning.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Sorry, I am unable to process your request right now. Please try again later.';
  }
}

module.exports = { getChatResponse };