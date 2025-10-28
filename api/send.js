export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    fullname, mobile, email,
    product, date, panel_email, panel_password
  } = req.body;

  const htmlContent = `
    <h2 style="color:#7200ff">New Invoice Request</h2>
    <p><b>Name:</b> ${fullname}</p>
    <p><b>Mobile:</b> ${mobile}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Product:</b> ${product}</p>
    <p><b>Date:</b> ${date}</p>
    <p><b>Panel Email:</b> ${panel_email}</p>
    <p><b>Password:</b> ${panel_password}</p>
  `;

  const mail = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "CoRamTix Billing <no-reply@coramtix.in>",
      to: "billing@coramtix.in",
      subject: "New CoRamTix Billing Request",
      html: htmlContent
    })
  });

  if (mail.ok) return res.status(200).json({ success: true });
  return res.status(500).json({ error: "Email failed" });
}
