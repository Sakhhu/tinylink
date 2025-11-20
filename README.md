Tech Stack Used:
Next.js 14+ (App Router)
TypeScript
Prisma ORM
PostgreSQL (Neon DB)
TailwindCSS
Thunder Client (API testing)

Project Overview:
TinyLink allows users to:
Create a short link with a custom code
Store the link in a database
Redirect users when they visit /shortCode
Track how many times the link has been clicked
Show basic analytics on a small dashboard page

How to Run the Project Locally:
1. Clone the repository
git clone https://github.com/Sakhhu/tinylink
cd tinylink

2. Install dependencies
npm install

3. Create a .env file

Add your database URL:

DATABASE_URL="postgresql://neondb_owner:npg_F9tb4xpowRlO@ep-wandering-water-a12p2d6v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


4. Run Prisma
npx prisma generate
npx prisma migrate dev

5. Start the development server
npm run dev


Open http://localhost:3000

Completed Features:
1. Project Setup

Full Next.js project structure created
TypeScript, Tailwind, Prisma all configured

2. Prisma Model

Link model created with:
shortCode
originalUrl
clicks
lastClickedAt
timestamps

3. Database Setup

Neon database created
Prisma connected successfully
Migrations created and synced

4. API Endpoint to Create Short Link (POST /api/links)

Accepts JSON (shortCode + originalUrl)
Stores in database
Tested using Thunder Client

5. Redirect Route Structure Created

Folder /app/[code]/route.ts created
Base setup done for redirect logic

6. Basic Dashboard Page Added

UI structure created
Page loads successfully in browser

7. GitHub Submission

Full project pushed to public repo
Clean folder structure

Pending / Partially Completed Features
1. Redirect Logic

Inside /app/[code]/route.ts, the following is pending:

Fetch link by shortCode
If found: update click count + timestamp
Redirect to original URL

2. Dashboard Data Fetching

Fetch list of all links from Prisma
Display in UI
Show clicks & last clicked timestamp

3. Error Handling

Return proper JSON for missing fields
Handle invalid short codes gracefully

4. README Documentation Enhancements

Add screenshots
Add detailed API documentation

API Endpoints (Implemented)
POST /api/links

Create a new short link.

Request:
{
  "shortCode": "docs",
  "originalUrl": "https://example.com"
}

Success Response:
{
  "message": "Link created successfully"
}

Screenshots (Can Be Added Later):

Thunder Client request for POST /api/links
Database table (Neon Console)
App home page
Dashboard preview

Challenges Faced:

Environment variable not loading (DATABASE_URL missing)
Prisma client not generating
Redirect route initially causing internal server error
Turbopack + Next.js locking issue while running npm run dev
Multiple Node processes blocking .next/dev/lock
Learning new stack while solving assignment

Candidate:
Shital Savant
Aspiring Backend / Full-Stack Developer
Passionate about backend systems, APIs, database design, and problem-solving.
