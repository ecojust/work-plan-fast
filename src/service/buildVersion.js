import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Format date to YYYY-MM-DD HH:mm:ss
function formatDate(date) {
  const pad = (num) => String(num).padStart(2, "0");
  const d = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;

  const t = `    ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;

  return d;
}

// Read current version from package.json
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../../package.json"), "utf8")
);
const version = packageJson.version;
const currentTime = formatDate(new Date());

// Create the new content
const content = `export const version = "${version}";
export const time = "${currentTime}";
// export const version = "0.1.0"; --- IGNORE ---
`;

// Write to version.ts
writeFileSync(resolve(__dirname, "./version.ts"), content, "utf8");

console.log(`Version information updated:
Version: ${version}
Time: ${currentTime}`);
