export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FlowDesk <onboarding@resend.dev>',
        to: 'bryan.zambon@gmail.com',
        subject: 'New FlowDesk Waitlist Signup',
        html: `<h2>New signup</h2><p><strong>Email:</strong> ${email}</p><p>They joined the FlowDesk waitlist.</p>`
      })
    });

    if (!response.ok) throw new Error('Resend error');

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send' });
  }
}
