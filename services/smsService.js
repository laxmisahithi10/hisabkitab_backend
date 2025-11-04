const twilio = require('twilio');

let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendSMS(to, message) {
  try {
    if (!twilioClient) {
      console.log('Twilio not configured. SMS not sent:', message);
      return { success: false, message: 'Twilio not configured' };
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSMS };