
const Newsletter =require("../../models/Newsletter")
const sendEmail = require("../../helpers/sendEmail")

const subscribe = async (req, res) => {
  const { email } = req.body

  // Basic email validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Valid email is required" })
  }

  try {
    const existing = await Newsletter.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: "You're already subscribed!" })
    }

    const entry = await Newsletter.create({ email })

    const emailContent = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; color: #6C63FF; margin: 0;">Welcome to ClapStudio 🎉</h1>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Hey there 👋,
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        Thank you for subscribing to <strong>ClapStudio</strong> — your go-to source for modern fashion, trends, and member-only perks.
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">
        We're thrilled to have you in our community. Expect exciting updates, new arrivals, and style inspiration in your inbox soon!
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="https://clapstudio.com" style="background-color: #6C63FF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
          Visit Our Store
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />

      <p style="font-size: 14px; color: #999; text-align: center;">
        If you didn't subscribe to ClapStudio, feel free to disregard this message.
      </p>
    </div>
  </div>
`


    await sendEmail({
      to: email,
      subject: "🎉 You're now subscribed to ClapStudio!",
      html: emailContent,
    })

    res.status(201).json({
      message: "Subscribed successfully. Confirmation email sent.",
      entry,
    })
  } catch (error) {
    console.error("Subscription error:", error)
    res.status(500).json({ error: "Something went wrong. Please try again later." })
  }
}

module.exports = { subscribe }
