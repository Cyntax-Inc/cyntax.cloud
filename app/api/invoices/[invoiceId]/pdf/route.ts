import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { db } from "../../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../../lib/currentUser";

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount || 0) / 100);
}

function safeLine(value: unknown) {
  return String(value ?? "").trim();
}

function toDateString(value: unknown) {
  if (!value) return "—";

  if (typeof (value as any)?.toDate === "function") {
    return (value as any).toDate().toLocaleDateString("en-US");
  }

  if (typeof (value as any)?._seconds === "number") {
    return new Date((value as any)._seconds * 1000).toLocaleDateString("en-US");
  }

  if (typeof value === "number") {
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US");
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US");
}

function wrapText(
  text: string,
  font: any,
  size: number,
  maxWidth: number
): string[] {
  const words = safeLine(text).split(/\s+/).filter(Boolean);
  if (!words.length) return ["—"];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, size);

    if (width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const user = await getCurrentUserProfile();
    const { invoiceId } = await params;

    if (!invoiceId) {
      return new Response("Missing invoice ID", { status: 400 });
    }

    const invoiceSnap = await db.collection("invoices").doc(invoiceId).get();

    if (!invoiceSnap.exists) {
      return new Response("Invoice not found", { status: 404 });
    }

    const invoice = invoiceSnap.data();

    if (!invoice) {
      return new Response("Invoice data not found", { status: 404 });
    }

    const normalizedRole = String(user?.role || "").trim().toLowerCase();
    const isAdmin = normalizedRole === "admin";
    const isOwner = invoice.userId === user?.uid;

    if (!isAdmin && !isOwner) {
      return new Response("Forbidden", { status: 403 });
    }

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();

    let y = height - 60;

    page.drawText(safeLine(invoice.issuerCompanyName) || "Invoice", {
      x: 50,
      y,
      size: 24,
      font: bold,
      color: rgb(0.12, 0.12, 0.12),
    });

    y -= 30;
    page.drawText(`Invoice #: ${safeLine(invoice.invoiceNumber) || invoiceId}`, {
      x: 50,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 18;
    page.drawText(`Issue Date: ${toDateString(invoice.createdAt)}`, {
      x: 50,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 18;
    page.drawText(`Due Date: ${toDateString(invoice.dueDate)}`, {
      x: 50,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 40;
    page.drawText("From", {
      x: 50,
      y,
      size: 12,
      font: bold,
      color: rgb(0.3, 0.3, 0.3),
    });

    y -= 18;

    const issuerLines = [
      invoice.issuerCompanyName,
      invoice.issuerName,
      invoice.issuerEmail,
      invoice.issuerWebsite,
      invoice.issuerAddressLine1,
      invoice.issuerAddressLine2,
      [invoice.issuerCity, invoice.issuerState, invoice.issuerPostalCode]
        .filter(Boolean)
        .join(", "),
      invoice.issuerCountry,
    ]
      .map(safeLine)
      .filter(Boolean);

    for (const line of issuerLines) {
      page.drawText(line, {
        x: 50,
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= 14;
    }

    let rightY = height - 148;

    page.drawText("Bill To", {
      x: 340,
      y: rightY,
      size: 12,
      font: bold,
      color: rgb(0.3, 0.3, 0.3),
    });

    rightY -= 18;

    const clientLines = [
      invoice.clientCompanyName,
      invoice.clientName,
      invoice.billingEmail || invoice.clientEmail,
    ]
      .map(safeLine)
      .filter(Boolean);

    for (const line of clientLines) {
      page.drawText(line, {
        x: 340,
        y: rightY,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      rightY -= 14;
    }

    y = Math.min(y, rightY) - 40;

    page.drawRectangle({
      x: 50,
      y: y - 26,
      width: width - 100,
      height: 28,
      color: rgb(0.95, 0.95, 0.98),
    });

    page.drawText("Description", {
      x: 60,
      y: y - 17,
      size: 10,
      font: bold,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText("Amount", {
      x: 470,
      y: y - 17,
      size: 10,
      font: bold,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 48;

    const descriptionLines = wrapText(
      safeLine(invoice.description) || "—",
      font,
      11,
      380
    );

    const amountText = formatMoney(
      Number(invoice.amount || 0),
      safeLine(invoice.currency) || "usd"
    );
    const amountWidth = font.widthOfTextAtSize(amountText, 11);
    const amountY = y;

    for (const line of descriptionLines) {
      page.drawText(line, {
        x: 60,
        y,
        size: 11,
        font,
        color: rgb(0.12, 0.12, 0.12),
      });
      y -= 14;
    }

    page.drawText(amountText, {
      x: width - 50 - amountWidth,
      y: amountY,
      size: 11,
      font,
      color: rgb(0.12, 0.12, 0.12),
    });

    y -= 24;

    page.drawLine({
      start: { x: 340, y },
      end: { x: 562, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.9),
    });

    y -= 20;
    page.drawText("Total", {
      x: 400,
      y,
      size: 12,
      font: bold,
      color: rgb(0.12, 0.12, 0.12),
    });

    const totalWidth = bold.widthOfTextAtSize(amountText, 12);
    page.drawText(amountText, {
      x: width - 50 - totalWidth,
      y,
      size: 12,
      font: bold,
      color: rgb(0.12, 0.12, 0.12),
    });

    y -= 50;
    page.drawText(
      `Status: ${safeLine(invoice.status).replaceAll("_", " ") || "open"}`,
      {
        x: 50,
        y,
        size: 10,
        font,
        color: rgb(0.28, 0.28, 0.28),
      }
    );

    const pdfBytes = await pdfDoc.save();

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(pdfBytes);
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${
          safeLine(invoice.invoiceNumber) || invoiceId
        }.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Invoice PDF error:", error);

    return new Response(error?.message || "Unable to generate invoice PDF", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}