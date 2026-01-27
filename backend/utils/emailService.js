const nodemailer = require('nodemailer');

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_PASS        // Your Gmail App Password
    }
});

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"${process.env.SENDER_NAME || 'Assignment Approval System'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin: 0;">Assignment Approval System</h1>
                </div>
                
                <h2 style="color: #1f2937;">Password Reset Request</h2>
                <p style="color: #4b5563; font-size: 16px;">You requested to reset your password. Use the OTP below:</p>
                
                <div style="background-color: #f3f4f6; padding: 25px; text-align: center; margin: 25px 0; border-radius: 10px; border: 2px dashed #d1d5db;">
                    <h1 style="color: #1f2937; letter-spacing: 8px; margin: 0; font-size: 36px; font-weight: bold;">${otp}</h1>
                </div>
                
                <p style="color: #6b7280; font-size: 14px;">⏱️ This OTP is valid for <strong>5 minutes</strong>.</p>
                <p style="color: #6b7280; font-size: 14px;">🔒 If you didn't request this, please ignore this email.</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    This is an automated message from Assignment Approval System.<br>
                    Please do not reply to this email.
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent to:', email);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return { success: false, error: error.message };
    }
};

// Verify SMTP connection
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Gmail email service is ready');
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        return false;
    }
};

module.exports = { sendOTPEmail, verifyConnection };
