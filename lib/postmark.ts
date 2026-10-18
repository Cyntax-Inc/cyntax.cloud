import postmark from "postmark";

type TicketEmailPayload = {
  id: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
};

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[character] || character));
}

function getPostmarkClient() {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) throw new Error("Missing POSTMARK_SERVER_TOKEN");
  return new postmark.ServerClient(token);
}

export async function sendTicketEmail(ticket: TicketEmailPayload) {
  const client = getPostmarkClient();
  const safe = Object.fromEntries(Object.entries(ticket).map(([key, value]) => [key, escapeHtml(value)]));
  await client.sendEmail({
    From: "tickets@cyntax.org",
    To: "brandon@cyntax.org",
    Subject: `New Support Ticket: ${ticket.subject.replace(/[\r\n]/g, " ")}`,
    HtmlBody: `
      <h2>New Support Ticket</h2>
      <p><strong>Ticket ID:</strong> ${safe.id}</p>
      <p><strong>User Email:</strong> ${safe.email}</p>
      <p><strong>Subject:</strong> ${safe.subject}</p>
      <p><strong>Category:</strong> ${safe.category}</p>
      <p><strong>Priority:</strong> ${safe.priority}</p>
      <p><strong>Status:</strong> ${safe.status}</p>
      <hr />
      <p><strong>Description:</strong></p>
      <p>${safe.description.replace(/\n/g, "<br />")}</p>
    `,
    MessageStream: "outbound",
  });
}
