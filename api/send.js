export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullname, mobile, email, product, date } = req.body;

  // --- CoRamTix Professional HTML Invoice Email ---
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CoRamTix Invoice</title>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background: #f9f9fb;
        margin: 0;
        padding: 20px;
      }
      .invoice-container {
        background: #fff;
        border-radius: 12px;
        max-width: 700px;
        margin: auto;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .header {
        background: #7200ff;
        color: #fff;
        padding: 25px;
        text-align: center;
      }
      .header img {
        width: 60px;
        margin-bottom: 10px;
      }
      .invoice-body {
        padding: 30px;
      }
      h2 {
        color: #7200ff;
        margin-bottom: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      th, td {
        border: 1px solid #eee;
        padding: 12px;
        text-align: left;
      }
      th {
        background: #f4f4f9;
      }
      .total {
        text-align: right;
        font-size: 18px;
        font-weight: bold;
        color: #7200ff;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #666;
        padding: 20px;
        background: #f9f9fb;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <img src="https://www.coramtix.in/favicon.svg" alt="CoRamTix Logo">
        <h1>CoRamTix Invoice</h1>
        <p>Game & Bot Hosting Services</p>
      </div>

      <div class="invoice-body">
        <h2>Invoice Request Details</h2>
        <p><b>Name:</b> ${fullname}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Product:</b> ${product}</p>
        <p><b>Date:</b> ${date}</p>

        <table>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>${product}</td>
            <td>Requested CoRamTix Hosting Service</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td colspan="2" class="total">Total</td>
            <td class="total">Pending</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <p>Thank you for choosing <b>CoRamTix Hosting</b> 💜</p>
        <p>Need help? Contact us at <a href="mailto:support@coramtix.in">support@coramtix.in</a></p>
        <p>&copy; 2025 CoRamTix.in — All Rights Reserved</p>
      </div>
    </div>
  </body>
  </html>
  `;

  // --- Send Invoice Email via Resend ---
  const mail = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "CoRamTix Billing <no-reply@coramtix.in>",
      to: "billing@coramtix.in",
      subject: `Invoice Request - ${fullname}`,
      html: htmlContent
    })
  });

  // --- Send Notification to Discord Webhook ---
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL; // 🔐 Put your webhook in .env
  const discordMessage = {
    username: "CoRamTix Invoice Bot",
    avatar_url: "https://www.coramtix.in/favicon.svg",
    embeds: [
      {
        title: "🧾 New CoRamTix Invoice Request",
        color: 7506394, // #7200ff
        fields: [
          { name: "👤 Name", value: fullname, inline: true },
          { name: "📞 Mobile", value: mobile, inline: true },
          { name: "📧 Email", value: email, inline: false },
          { name: "🎮 Product", value: product, inline: false },
          { name: "📅 Date", value: date, inline: false }
        ],
        footer: {
          text: "CoRamTix Invoice System",
          icon_url: "https://www.coramtix.in/favicon.svg"
        },
        timestamp: new Date()
      }
    ]
  };

  await fetch(discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(discordMessage)
  });

  // --- Response ---
  if (mail.ok) {
    return res.status(200).json({ success: true, message: "Invoice sent and saved to Discord!" });
  } else {
    return res.status(500).json({ error: "Email failed but Discord log saved" });
  }
}
