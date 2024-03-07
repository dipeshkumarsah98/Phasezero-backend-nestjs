import { createHmac } from 'crypto';

const createSignature = (message: string) => {
  const secret = process.env.ESEWA_SECRET || '8gBm/:&EnhH.1/q';

  try {
    const hmac = createHmac('sha256', secret).update(message).digest('base64');

    return hmac;
  } catch (error) {
    console.error('Error creating HMAC:', error);
    throw new Error('HMAC not created');
  }
};

export default createSignature;
