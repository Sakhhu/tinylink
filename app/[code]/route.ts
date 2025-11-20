// app/[code]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Redirect route: GET /:code
 * - Finds link by shortCode
 * - Updates analytics (clicks, lastClickedAt)
 * - Performs a 302 redirect to originalUrl
 */
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const shortCode = params.code;

  try {
    // 1) Find the link
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      // Not found -> 404
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // 2) Update clicks and lastClickedAt.
    // Use update to ensure DB is consistent. We don't need to read again.
    await prisma.link.update({
      where: { shortCode },
      data: {
        clicks: link.clicks + 1,
        lastClickedAt: new Date(),
      },
    });

    // 3) Redirect to the original URL (302)
    // NextResponse.redirect(url, status) returns a redirect response.
    return NextResponse.redirect(link.originalUrl, 302);

  } catch (err: any) {
    // Prisma-specific error handling (optional)
    console.error(`Redirect failed for code=${shortCode}:`, err);

    // If Prisma says record doesn't exist (P2025) during update, return 404
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Generic server error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
