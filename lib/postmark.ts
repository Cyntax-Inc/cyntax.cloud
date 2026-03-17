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

function getPostmarkClient() {
  const token = process.env.POSTMARK_SERVER_TOKEN;

  if (!token) {
    throw new Error("Missing POSTMARK_SERVER_TOKEN");
  }

  return new postmark.ServerClient(token);
}

export async function sendTicketEmail(ticket: TicketEmailPayload) {
  const client = getPostmarkClient();

  await client.sendEmail({
    From: "tickets@cyntax.org",
    To: "brandon@cyntax.org",
    Subject: `New Support Ticket: ${ticket.subject}`,
    HtmlBody: `
      <h2>New Support Ticket</h2>
      <p><strong>Ticket ID:</strong> ${ticket.id}</p>
      <p><strong>User Email:</strong> ${ticket.email}</p>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <p><strong>Priority:</strong> ${ticket.priority}</p>
      <p><strong>Status:</strong> ${ticket.status}</p>
      <hr />
      <p><strong>Description:</strong></p>
      <p>${ticket.description.replace(/\n/g, "<br />")}</p>
    `,
    MessageStream: "outbound",
  });
}