import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { db } from "../../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../../lib/currentUser";

function money(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((v || 0) / 100);
}

function txt(v: any) {
  return String(v ?? "").trim();
}

function dateLong(v: any) {
  if (!v) return "—";

  const date = new Date(v);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function safeInvoiceNumber(v: any) {
  const raw = txt(v);
  return raw.replace(/^INV-?/i, "");
}

function drawRightText(
  page: any,
  text: string,
  xRight: number,
  y: number,
  font: any,
  size: number,
  color = rgb(0, 0, 0)
) {
  const value = String(text ?? "");
  const width = font.widthOfTextAtSize(value, size);

  page.drawText(value, {
    x: xRight - width,
    y,
    size,
    font,
    color,
  });
}

function wrapText(text: string, font: any, size: number, maxWidth: number) {
  const value = txt(text);
  if (!value) return [""];

  const words = value.split(/\s+/);
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

  return lines.length ? lines : [""];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const { invoiceId } = await params;

  const user = await getCurrentUserProfile();
  const snap = await db.collection("invoices").doc(invoiceId).get();

  if (!snap.exists) {
    return new Response("Not found", { status: 404 });
  }

  const inv: any = snap.data() || {};

  if (
    inv.userId !== user.uid &&
    (user.role || "").toLowerCase() !== "admin"
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const colors = {
    text: rgb(0.16, 0.16, 0.16),
    dark: rgb(0.23, 0.23, 0.23),
    label: rgb(0.45, 0.45, 0.45),
    lightGray: rgb(0.94, 0.94, 0.94),
    line: rgb(0.85, 0.85, 0.85),
    white: rgb(1, 1, 1),
  };

  const leftX = 52;
  const contentRight = 560;

  // Optional logo support
  // Supports inv.issuerLogoBase64 as a data URL or raw base64 string.
  // If missing, the invoice still renders fine.
  if (inv.issuerLogoBase64) {
    try {
      const rawLogo = String(inv.issuerLogoBase64).trim();

      if (rawLogo.startsWith("data:image/png;base64,")) {
        const pngBytes = Uint8Array.from(
          Buffer.from(rawLogo.replace(/^data:image\/png;base64,/, ""), "base64")
        );
        const png = await pdf.embedPng(pngBytes);
        page.drawImage(png, {
          x: 50,
          y: 640,
          width: 110,
          height: 110,
        });
      } else if (rawLogo.startsWith("data:image/jpeg;base64,")) {
        const jpgBytes = Uint8Array.from(
          Buffer.from(
            rawLogo.replace(/^data:image\/jpeg;base64,/, ""),
            "base64"
          )
        );
        const jpg = await pdf.embedJpg(jpgBytes);
        page.drawImage(jpg, {
          x: 50,
          y: 640,
          width: 110,
          height: 110,
        });
      } else {
        // assume raw base64 PNG
        const pngBytes = Uint8Array.from(Buffer.from(rawLogo, "base64"));
        const png = await pdf.embedPng(pngBytes);
        page.drawImage(png, {
          x: 50,
          y: 640,
          width: 110,
          height: 110,
        });
      }
    } catch {
      // swallow logo failures so PDF still renders
    }
  }

  // =====================
  // HEADER
  // =====================
  drawRightText(page, "INVOICE", contentRight, 732, font, 28, colors.dark);
  drawRightText(
    page,
    `# ${safeInvoiceNumber(inv.invoiceNumber)}`,
    contentRight,
    706,
    font,
    14,
    colors.label
  );

  // =====================
  // ISSUER BLOCK
  // =====================
  let yLeft = 576;

  const issuerName = txt(inv.issuerCompanyName);
  const issuerLines = [
    txt(inv.issuerAddressLine1),
    txt(inv.issuerAddressLine2),
    [inv.issuerCity, inv.issuerState, inv.issuerPostalCode]
      .filter(Boolean)
      .join(", "),
  ].filter(Boolean);

  if (issuerName) {
    page.drawText(issuerName, {
      x: 68,
      y: yLeft,
      size: 11,
      font: bold,
      color: colors.text,
    });
    yLeft -= 18;
  }

  issuerLines.forEach((line: string) => {
    page.drawText(txt(line), {
      x: 68,
      y: yLeft,
      size: 10,
      font,
      color: colors.text,
    });
    yLeft -= 14;
  });

  yLeft -= 26;

  page.drawText("Bill To:", {
    x: 68,
    y: yLeft,
    size: 10,
    font,
    color: colors.label,
  });

  yLeft -= 20;

  const addr = inv.billingAddress || {};
  const clientName = txt(inv.clientCompanyName);
  const billLines = [
    txt(addr.line1),
    txt(addr.line2),
    [addr.city, addr.state, addr.postalCode].filter(Boolean).join(", "),
  ].filter(Boolean);

  if (clientName) {
    page.drawText(clientName, {
      x: 68,
      y: yLeft,
      size: 11,
      font: bold,
      color: colors.text,
    });
    yLeft -= 18;
  }

  billLines.forEach((line: string) => {
    page.drawText(txt(line), {
      x: 68,
      y: yLeft,
      size: 10,
      font,
      color: colors.text,
    });
    yLeft -= 14;
  });

  // =====================
  // RIGHT META BLOCK
  // =====================
  const metaLabelRight = 440;
  const metaValueRight = 560;

  let yMeta = 620;

  const metaRows = [
    ["Date:", dateLong(inv.invoiceDate || inv.createdAt)],
    ["Payment Terms:", txt(inv.paymentTerms) || "—"],
    ["Due Date:", dateLong(inv.dueDate)],
  ];

  metaRows.forEach(([label, value]) => {
    drawRightText(page, label, metaLabelRight, yMeta, font, 10, colors.label);
    drawRightText(page, String(value), metaValueRight, yMeta, font, 10, colors.text);
    yMeta -= 28;
  });

  // Balance Due box
  const balanceBoxX = 300;
  const balanceBoxY = 516;
  const balanceBoxW = 260;
  const balanceBoxH = 30;

  page.drawRectangle({
    x: balanceBoxX,
    y: balanceBoxY,
    width: balanceBoxW,
    height: balanceBoxH,
    color: colors.lightGray,
    borderWidth: 0,
  });

  drawRightText(
    page,
    "Balance Due:",
    430,
    balanceBoxY + 10,
    bold,
    11,
    colors.dark
  );

  drawRightText(
    page,
    money(Number(inv.total ?? inv.amount ?? 0)),
    560,
    balanceBoxY + 10,
    bold,
    11,
    colors.dark
  );

  // =====================
  // TABLE HEADER
  // =====================
  const tableX = 52;
  const tableY = 378;
  const tableW = 508;
  const tableH = 24;

  page.drawRectangle({
    x: tableX,
    y: tableY,
    width: tableW,
    height: tableH,
    color: colors.dark,
    borderWidth: 0,
  });

  page.drawText("Item", {
    x: 64,
    y: tableY + 8,
    size: 10,
    font,
    color: colors.white,
  });

  page.drawText("Quantity", {
    x: 352,
    y: tableY + 8,
    size: 10,
    font,
    color: colors.white,
  });

  page.drawText("Rate", {
    x: 448,
    y: tableY + 8,
    size: 10,
    font,
    color: colors.white,
  });

  page.drawText("Amount", {
    x: 508,
    y: tableY + 8,
    size: 10,
    font,
    color: colors.white,
  });

  // =====================
  // ITEMS
  // =====================
  const items =
    inv.lineItems?.length > 0
      ? inv.lineItems
      : [
          {
            description: inv.description,
            quantity: 1,
            rate: inv.amount,
            amount: inv.amount,
          },
        ];

  let y = 350;
  const itemDescX = 64;
  const qtyX = 352;
  const rateRight = 468;
  const amountRight = 560;
  const descMaxWidth = 255;

  items.forEach((i: any) => {
    const qty = Number(i.quantity ?? 1);
    const rate = Number(i.rate ?? i.amount ?? 0);
    const amount = Number(i.amount ?? qty * rate);
    const descLines = wrapText(txt(i.description), bold, 10, descMaxWidth);

    descLines.forEach((line, idx) => {
      page.drawText(line, {
        x: itemDescX,
        y,
        size: 10,
        font: bold,
        color: colors.text,
      });

      if (idx === 0) {
        page.drawText(String(qty), {
          x: qtyX,
          y,
          size: 10,
          font,
          color: colors.text,
        });

        drawRightText(page, money(rate), rateRight, y, font, 10, colors.text);
        drawRightText(page, money(amount), amountRight, y, font, 10, colors.text);
      }

      y -= 14;
    });

    y -= 6;
  });

  // light line after items
  page.drawLine({
    start: { x: 52, y: y + 6 },
    end: { x: 560, y: y + 6 },
    thickness: 1,
    color: colors.line,
  });

  y -= 22;

  // =====================
  // TOTALS
  // =====================
  const subtotal = Number(inv.subtotal ?? inv.amount ?? 0);
  const tax = Number(inv.taxAmount ?? 0);
  const total = Number(inv.total ?? inv.amount ?? 0);
  const taxRate = Number(inv.taxRate ?? 0);

  const totalsLabelRight = 448;
  const totalsValueRight = 560;

  const totals = [
    ["Subtotal:", money(subtotal), false],
    [`Tax (${taxRate}%):`, money(tax), false],
    ["Total:", money(total), true],
  ] as const;

  totals.forEach(([label, value, isTotal]) => {
    drawRightText(
      page,
      label,
      totalsLabelRight,
      y,
      isTotal ? bold : font,
      isTotal ? 11 : 10,
      colors.label
    );

    drawRightText(
      page,
      value,
      totalsValueRight,
      y,
      isTotal ? bold : font,
      isTotal ? 11 : 10,
      colors.text
    );

    y -= 24;
  });

  const bytes = await pdf.save();

  // Copy into a plain ArrayBuffer
  const buffer = new Uint8Array(bytes).slice().buffer;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${txt(inv.invoiceNumber) || "invoice"}.pdf"`,
    },
  });
}