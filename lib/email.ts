import { Resend } from "resend";

function createResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export const resend = createResend();

const FROM = "PortfolioForge <hello@portfolioforge.dev>";

export async function sendWelcomeEmail(to: string, name: string) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to PortfolioForge 🎉",
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account is ready. Here's how to get started:</p>
      <ol>
        <li>Browse the <a href="https://portfolioforge.dev/components">component library</a></li>
        <li>Fill in your <a href="https://portfolioforge.dev/dashboard/details">details</a> — our AI will structure everything</li>
        <li>Pick a theme and pattern</li>
        <li>Publish your portfolio</li>
      </ol>
      <p>Your public URL will be: <strong>portfolioforge.dev/u/your-slug</strong></p>
      <p>Questions? Reply to this email anytime.</p>
    `,
  });
}

export async function sendPortfolioLiveEmail(to: string, name: string, slug: string) {
  if (!resend) return;
  const url = `https://portfolioforge.dev/u/${slug}`;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your portfolio is live! 🚀",
    html: `
      <h2>Your portfolio is live, ${name}!</h2>
      <p>Share it with the world:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Tip: Add your portfolio URL to your GitHub profile and LinkedIn.</p>
    `,
  });
}

export async function sendProWelcomeEmail(to: string, name: string) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're now a PortfolioForge Pro member ⚡",
    html: `
      <h2>Welcome to Pro, ${name}!</h2>
      <p>You now have access to:</p>
      <ul>
        <li>All themes and animated patterns</li>
        <li>All 27 portfolio sections</li>
        <li>Unlimited AI regenerations</li>
        <li>Portfolio analytics</li>
        <li>Custom domain support</li>
      </ul>
      <p><a href="https://portfolioforge.dev/dashboard">Go to your dashboard →</a></p>
    `,
  });
}

export async function sendPaymentFailedEmail(to: string, name: string) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Action required: payment failed",
    html: `
      <h2>Hi ${name},</h2>
      <p>We couldn't process your latest payment for PortfolioForge Pro.</p>
      <p>Please <a href="https://portfolioforge.dev/dashboard/settings">update your payment method</a> to keep your Pro features.</p>
    `,
  });
}

export async function sendCancellationEmail(to: string, name: string, periodEnd: Date) {
  if (!resend) return;
  const date = periodEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your PortfolioForge Pro subscription has been cancelled",
    html: `
      <h2>Hi ${name},</h2>
      <p>Your Pro subscription has been cancelled. You'll keep Pro access until <strong>${date}</strong>.</p>
      <p>After that, your portfolio will remain published but the free-tier limits will apply.</p>
      <p>Changed your mind? <a href="https://portfolioforge.dev/dashboard/upgrade">Resubscribe anytime.</a></p>
    `,
  });
}
