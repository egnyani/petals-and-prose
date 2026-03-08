import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to_email, to_name, from_name, subject, message } = req.body;

  if (!to_email || !message || !from_name) {
    return res.status(400).json({ error: 'Missing required fields: to_email, message, from_name' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured. Add it in Vercel project settings.' });
  }

  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromLabel = process.env.FROM_LABEL || 'Send in Bloom';

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 18px; line-height: 1.8; color: #2C1E14; white-space: pre-wrap;">${escapeHtml(message)}</p>
      <p style="margin-top: 24px; font-size: 14px; color: #7A6858;">— from ${escapeHtml(from_name)} with love —</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: `${fromLabel} <${fromEmail}>`,
    to: [to_email],
    subject: subject || `A letter from ${from_name}`,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }

  return res.status(200).json({ success: true, id: data?.id });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
