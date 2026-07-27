const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let raw = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => { raw += chunk; });
    req.on('end', resolve);
    req.on('error', reject);
  });

  const params = new URLSearchParams(raw);
  const name = params.get('name');
  const email = params.get('email');
  const subject = params.get('subject');
  const message = params.get('message');

  if (!name || !email || !subject || !message) {
    res.writeHead(302, { Location: '/contact.html?status=error&msg=All+fields+are+required.' });
    res.end();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.writeHead(302, { Location: '/contact.html?status=error&msg=Invalid+email+address.' });
    res.end();
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .header { background: #475569; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 700; color: #1e293b; }
    .value { color: #475569; margin-top: 4px; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h2>New Contact Form Submission</h2></div>
  <div class="content">
    <div class="field"><div class="label">Name:</div><div class="value">${name}</div></div>
    <div class="field"><div class="label">Email:</div><div class="value">${email}</div></div>
    <div class="field"><div class="label">Subject:</div><div class="value">${subject}</div></div>
    <div class="field"><div class="label">Message:</div><div class="value">${message}</div></div>
  </div>
  <div class="footer"><p>Sent via InKZion Spectrum Ads Contact Form</p></div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || 'inkzionspectrum@gmail.com',
      subject: `Contact Form: ${subject} - InKZion Spectrum Ads`,
      html,
    });

    res.writeHead(302, { Location: '/contact.html?status=success' });
  } catch {
    res.writeHead(302, { Location: '/contact.html?status=error&msg=Failed+to+send+message.+Please+try+again.' });
  }
  res.end();
};