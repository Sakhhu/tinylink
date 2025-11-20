// app/api/links/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// --- Utility Functions ---
const SHORT_CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  // Generate 6 character code if custom code isn't provided (min length requirement)
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// --- API Handlers ---

// POST /api/links (Create short link)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { targetUrl, customCode } = data;

    if (!targetUrl) {
      return NextResponse.json({ error: "Target URL is required." }, { status: 400 });
    }
    
    // 1. Validate Target URL (Basic check)
    try {
        new URL(targetUrl);
    } catch (e) {
        return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    let shortCode = customCode;

    // 2. Handle Custom Code Validation
    if (customCode) {
        if (!SHORT_CODE_REGEX.test(customCode)) {
             return NextResponse.json({ error: "Custom code must be 6-8 alphanumeric characters." }, { status: 400 });
        }
        
        // Check for existing custom code (409 required)
        const existingLink = await prisma.link.findUnique({
            where: { shortCode: customCode },
        });

        if (existingLink) {
            // Assignment requirement: 409 Conflict if code exists
            return NextResponse.json({ 
                error: "Custom code already exists.",
            }, { status: 409 }); 
        }

    } else {
        // 3. Generate Random Code until unique
        let isUnique = false;
        while (!isUnique) {
            shortCode = generateRandomCode();
            const existingLink = await prisma.link.findUnique({
                where: { shortCode: shortCode },
            });
            if (!existingLink) {
                isUnique = true;
            }
        }
    }

    // 4. Create the new link in the database
    const newLink = await prisma.link.create({
      data: {
        shortCode: shortCode,
        originalUrl: targetUrl,
      },
      select: {
          shortCode: true,
          originalUrl: true,
          clicks: true,
          createdAt: true 
      }
    });
    
    // Success response (201 Created)
    return NextResponse.json(newLink, { status: 201 });
    
  } catch (error) {
    console.error("Link creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// GET /api/links (List all links)
export async function GET() {
    try {
        const links = await prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Map the Prisma model to match the required output names
        const mappedLinks = links.map(link => ({
            shortCode: link.shortCode,
            targetUrl: link.originalUrl,
            totalClicks: link.clicks,
            lastClickedTime: link.lastClickedAt ? link.lastClickedAt.toISOString() : null,
        }));

        return NextResponse.json(mappedLinks, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch links:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}