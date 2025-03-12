const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.SENDING_GMAIL_USER,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

module.exports.sendVerificationEmail = async (email, token) => {
	const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

	const mailOptions = {
		from: `"AI Interview Platform" <${process.env.EMAIL_FROM}>`,
		to: email,
		subject: "Verify Your Email Address",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AI Interview Platform</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Welcome!</h2>
          <p>Thank you for registering. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6B7280;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #4F46E5;">${verificationUrl}</a>
          </p>
        </div>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`Verification email sent to ${email}`);
		return true;
	} catch (error) {
		console.error("Error sending verification email:", error);
		throw new Error(
			"Error sending verification email. Please try again later."
		);
	}
};

module.exports.sendWelcomeEmail = async (email, name) => {
	const loginUrl = `${process.env.FRONTEND_URL}/login`;

	const mailOptions = {
		from: `"AI Interview Platform" <${process.env.EMAIL_FROM}>`,
		to: email,
		subject: "Welcome to AI Interview Platform",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AI Interview Platform</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Welcome, ${name}!</h2>
          <p>Your email has been verified and your account is now active.</p>
          <p>With AI Interview Platform, you can:</p>
          <ul style="padding-left: 20px;">
            <li>Practice technical interviews with our AI interviewer</li>
            <li>Receive personalized feedback on your performance</li>
            <li>Track your progress and identify areas for improvement</li>
            <li>Get recommendations for learning resources</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Start Practicing Now
            </a>
          </div>
          <p>We're excited to help you improve your interview skills!</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6B7280;">
            If you have any questions or need assistance, please contact our support team.
          </p>
        </div>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`Welcome email sent to ${email}`);
		return true;
	} catch (error) {
		console.error("Error sending welcome email:", error);
		throw new Error("Error sending welcome email. Please try again later.");
	}
};
