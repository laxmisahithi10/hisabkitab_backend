const openAIService = require('../services/openAIService');

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    const reply = await openAIService.getChatResponse(message);

    res.json({ reply });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat };