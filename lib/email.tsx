import { Resend } from "resend"

// Lazy initialization to avoid build-time errors when API key is not set
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured")
  }
  return new Resend(apiKey)
}

interface TestFailureEmailProps {
  to: string
  suiteName: string
  failedCount: number
  passedCount: number
  totalCount: number
  executionId: string
}

export async function sendTestFailureNotification({
  to,
  suiteName,
  failedCount,
  passedCount,
  totalCount,
  executionId,
}: TestFailureEmailProps) {
  try {
    const resend = getResend()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://platypus-qa-lab.vercel.app"

    const { data, error } = await resend.emails.send({
      from: "Platypus QA Lab <notifications@platypuslab.dev>",
      to: [to],
      subject: `⚠️ Test Failures Detected: ${suiteName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Failure Notification</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🦦 Platypus QA Lab</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Test Failure Alert</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #dc2626; margin-top: 0;">⚠️ Tests Failed</h2>
              
              <p>Your scheduled test suite <strong>${suiteName}</strong> has completed with failures.</p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="margin-top: 0; color: #1f2937;">Test Results Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Total Tests:</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${totalCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #059669;">✓ Passed:</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #059669;">${passedCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #dc2626;">✗ Failed:</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #dc2626;">${failedCount}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; font-style: italic;">
                "A failed test is just a bug that's been caught before production. That's a win in my book!" 
                - The Platypus Philosophy
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${appUrl}/monitoring?execution=${executionId}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Full Report
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                You're receiving this because you set up notifications for this test suite.<br>
                Manage your notification settings in the Platypus QA Lab dashboard.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[-] Failed to send email:", error)
      return { success: false, error }
    }

    console.log("[-] Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[-] Email service error:", error)
    return { success: false, error }
  }
}
