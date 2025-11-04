const Tesseract = require('tesseract.js');
const Expense = require('../models/expense');

const parseReceipt = (text) => {
  let title = "";
  let amount = "";
  let date = "";
  let category = "";

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // --- Title Detection ---
  const skipWords = ["invoice", "receipt", "bill", "total", "amount"];
  const titleLine = lines.find(
    (l) => !skipWords.some((w) => l.toLowerCase().includes(w))
  );
  if (titleLine) title = titleLine;

  // --- Enhanced amount detection for bus bills ---
  const amountLine = lines.find((l) =>
    /(total|amount|fare|paid|price|grand|rs|₹)/i.test(l)
  );

  if (amountLine) {
    const amtMatch = amountLine.match(/₹?\s?\d{1,4}(\.\d{1,2})?/);
    if (amtMatch) {
      const amtValue = parseFloat(amtMatch[0].replace(/[^\d.]/g, ""));
      if (amtValue > 0 && amtValue < 10000) {
        amount = amtValue.toString();
      }
    }
  }

  if (!amount) {
    const allNumbers = text.match(/\d+(\.\d{1,2})?/g);
    if (allNumbers) {
      const validAmounts = allNumbers
        .map((n) => parseFloat(n))
        .filter((n) => !isNaN(n) && n > 0 && n < 10000 && n !== 2016 && n !== 2023 && n !== 2024); // exclude years
      if (validAmounts.length > 0) {
        amount = Math.max(...validAmounts).toString();
      }
    }
  }

  // --- Enhanced Date Detection ---
  const datePatterns = [
    /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g,
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/g,
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{2}\b/g,
    /\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{4}\b/gi,
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{1,2},?\s\d{4}\b/gi
  ];

  let foundDates = [];
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) foundDates.push(...matches);
  });

  if (foundDates.length > 0) {
    const parsedDates = foundDates
      .map((dateStr) => {
        try {
          let normalizedDate = dateStr.replace(/-/g, "/");
          
          if (/\d{1,2}\/\d{1,2}\/\d{2}$/.test(normalizedDate)) {
            const parts = normalizedDate.split('/');
            normalizedDate = `${parts[0]}/${parts[1]}/20${parts[2]}`;
          }
          
          const parsedDate = new Date(normalizedDate);
          const now = new Date();
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          
          if (parsedDate <= now && parsedDate >= oneYearAgo) {
            return parsedDate;
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (parsedDates.length > 0) {
      const latestDate = new Date(Math.max(...parsedDates.map(d => d.getTime())));
      date = latestDate.toISOString().split('T')[0];
    }
  }
  
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }

  // --- Enhanced Category Detection ---
  const textLower = text.toLowerCase();
  if (/uber|ola|bus|train|flight|ticket|travel|transport/i.test(textLower)) {
    category = "Travel";
  } else if (/restaurant|food|meal|dine|pizza|burger/i.test(textLower)) {
    category = "Food";
  } else if (/medical|pharmacy|hospital|doctor/i.test(textLower)) {
    category = "Health";
  } else if (/shopping|mall|store|clothes|apparel/i.test(textLower)) {
    category = "Shopping";
  } else if (/electricity|water|gas|bill|recharge/i.test(textLower)) {
    category = "Utilities";
  }

  return { title, amount, date, category };
};

const uploadBill = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Recognize text from buffer with better options
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng', { 
      logger: m => {},
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz₹/-:. '
    });

    // Use enhanced parsing logic
    const parsed = parseReceipt(text);

    // Return parsed data without saving to DB (let frontend handle it)
    res.json({ 
      title: parsed.title,
      amount: parsed.amount,
      date: parsed.date,
      category: parsed.category,
      ocrText: text 
    });
  } catch (error) {
    console.error('OCR Error:', error);
    next(error);
  }
};

module.exports = {
  uploadBill,
};