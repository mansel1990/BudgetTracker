import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import imaps from "imap-simple";
// @ts-ignore
import { simpleParser } from "mailparser";
import { EmailResponseSchemaType } from "@/schema/email";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const selectedDate = searchParams.get("date");

  if (!selectedDate) {
    return NextResponse.json(
      { error: "Missing date parameter" },
      { status: 400 }
    );
  }

  const imapConfig = {
    imap: {
      user: process.env.EMAIL_USER || "",
      password: process.env.EMAIL_PASSWORD || "",
      host: process.env.EMAIL_HOST || "",
      port: 993,
      tls: true,
      authTimeout: 10000,
    },
  };

  try {
    const connection = await imaps.connect(imapConfig);
    await connection.openBox("INBOX");

    const searchCriteria = ["ALL"];
    const fetchOptions = { bodies: [""], struct: true };

    const messages = await connection.search(searchCriteria, fetchOptions);
    const emails = await Promise.all(
      messages.map(async (msg: imaps.Message) => {
        const all = msg.parts.find(
          (part: { which: string }) => part.which === ""
        );
        if (!all || !all.body) return null;

        const parsed = await simpleParser(all.body, {
          defaultCharset: "utf-8",
        });

        let parsedBody = parsed.text ? parsed.text.trim() : "";

        if (!parsedBody && parsed.html) {
          const $ = cheerio.load(parsed.html);

          parsedBody = $("body").text().replace(/\s+/g, " ").trim();
        }

        if (!parsedBody) {
          return null;
        }

        // Skip emails that don’t have a valid subject
        if (
          !parsed.subject ||
          !parsed.subject.includes("You have done a UPI txn")
        )
          return null;

        const selectedDateSimple = new Date(selectedDate)
          .toISOString()
          .split("T")[0];
        const parsedDateSimple = parsed.date
          ? parsed.date.toISOString().split("T")[0]
          : "";

        // Skip if dates don't match
        if (selectedDateSimple !== parsedDateSimple) {
          return null;
        }

        const body = parsedBody.trim();

        // Extract amount
        const amountMatch = body.match(/Rs\.(\d+\.\d+)/);
        const amount = amountMatch
          ? parseFloat(amountMatch[1].replace(/,/g, ""))
          : null;

        if (amount === null) {
          return null;
        }

        // Extract payee name
        const payeeMatch = body.match(
          /VPA\s+\S+\s+([A-Za-z\s]+)\s+on\s+\d{2}-\d{2}-\d{2}/
        );
        const payee = payeeMatch ? payeeMatch[1].trim() : "Unknown";

        return {
          id: parsed.date
            ? parsed.date.getTime().toString() + parsed.from?.text
            : selectedDate, // Unique ID
          amount,
          description: payee,
          category: "Daily Essentials",
          transactionDate: selectedDate,
        };
      })
    );

    const filteredEmails = emails.filter(
      (email: EmailResponseSchemaType | null) => email !== null
    );

    return NextResponse.json(filteredEmails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
