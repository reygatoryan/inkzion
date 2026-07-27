const nodemailer = require('nodemailer');
const Busboy = require('busboy');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const fields = {};
  const attachments = [];

  await new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });

    busboy.on('field', (name, val) => {
      fields[name] = val;
    });

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      if (!filename) {
        file.resume();
        return;
      }
      const chunks = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => {
        attachments.push({
          filename,
          contentType: mimeType,
          content: Buffer.concat(chunks),
        });
      });
    });

    busboy.on('finish', resolve);
    busboy.on('error', reject);

    req.pipe(busboy);
  });

  const { name, email, phone, company, product, quantity, deadline, details } = fields;

  if (!name || !email || !details) {
    res.writeHead(302, { Location: '/inquiry.html?status=error&msg=Name,+email,+and+project+details+are+required.' });
    res.end();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.writeHead(302, { Location: '/inquiry.html?status=error&msg=Invalid+email+address.' });
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

  const fileInfo = attachments.length
    ? `File attached: ${attachments.map(a => a.filename).join(', ')}`
    : 'No file uploaded';

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
  <div class="header"><h2>New Product Inquiry</h2></div>
  <div class="content">
    <div class="field"><div class="label">Name:</div><div class="value">${name}</div></div>
    <div class="field"><div class="label">Email:</div><div class="value">${email}</div></div>
    <div class="field"><div class="label">Phone:</div><div class="value">${phone || 'N/A'}</div></div>
    <div class="field"><div class="label">Company:</div><div class="value">${company || 'N/A'}</div></div>
    <div class="field"><div class="label">Product of Interest:</div><div class="value">${product || 'N/A'}</div></div>
    <div class="field"><div class="label">Estimated Quantity:</div><div class="value">${quantity || 'N/A'}</div></div>
    <div class="field"><div class="label">Target Deadline:</div><div class="value">${deadline || 'N/A'}</div></div>
    <div class="field"><div class="label">Project Details:</div><div class="value">${details}</div></div>
    <div class="field"><div class="label">File:</div><div class="value">${fileInfo}</div></div>
  </div>
  <div class="footer"><p>Sent via InKZion Spectrum Ads Inquiry Form</p></div>
</body>
</html>`;

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.CONTACT_EMAIL || 'inkzionspectrum@gmail.com',
    subject: `New Inquiry: ${product || 'N/A'} - InKZion Spectrum Ads`,
    html,
  };

  if (attachments.length) {
    mailOptions.attachments = attachments;
  }

  try {
    await transporter.sendMail(mailOptions);
    res.writeHead(302, { Location: '/inquiry.html?status=success' });
  } catch {
    res.writeHead(302, { Location: '/inquiry.html?status=error&msg=Failed+to+send+inquiry.+Please+try+again.' });
  }
  res.end();
};