import fs from "fs";
import path from "path";

const apiUrl = process.env.VITE_API_URL || "https://r2-explorer.vercel.app";
const cleanUrl = apiUrl.replace(/\/$/, "");

console.log(
    `[Redirects Generator] Generating dist/_redirects pointing to: ${cleanUrl}`,
);

const content = `/api/*  ${cleanUrl}/api/:splat  200\n`;

// Ensure dist folder exists (it should, as this runs after vite build)
const distPath = path.resolve("dist");
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(path.join(distPath, "_redirects"), content);
console.log("[Redirects Generator] dist/_redirects generated successfully.");