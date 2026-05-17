import fs from "fs";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const root = process.cwd();
const dataDir = path.join(root, "data");
const cityDataDir = path.join(dataDir, "city-data");
const citiesFile = path.join(dataDir, "cities.ts");

const rl = readline.createInterface({ input, output });

function toVarName(slug) {
  return slug
    .split("-")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
}

async function ask(label, fallback = "") {
  const answer = await rl.question(
    fallback ? `${label} (${fallback}): ` : `${label}: `
  );
  return answer.trim() || fallback;
}

async function main() {
  fs.mkdirSync(cityDataDir, { recursive: true });

  const slug = await ask("slug 例 london-uk");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error("slugは小文字英数字とハイフンだけにしてください。例: london-uk");
    process.exit(1);
  }

  const city = await ask("city");
  const country = await ask("country");
  const stop1 = await ask("spot 1");
  const stop2 = await ask("spot 2");
  const stop3 = await ask("spot 3");

  const affHotelsUrl = await ask(
    "hotel affiliate url",
    `https://example.com/affiliate-hotels-${slug}`
  );

  const affToursUrl = await ask(
    "tour affiliate url",
    `https://example.com/affiliate-tours-${slug}`
  );

  const varName = toVarName(slug);
  const cityFile = path.join(cityDataDir, `${slug}.ts`);

  if (fs.existsSync(cityFile)) {
    const overwrite = await ask(`${slug}.ts already exists. overwrite? y/n`, "n");
    if (overwrite.toLowerCase() !== "y") {
      console.log("Canceled.");
      rl.close();
      return;
    }
  }

  const cityFileContent = `import type { City } from "../types";

export const ${varName}: City = {
  slug: "${slug}",
  city: "${city}",
  country: "${country}",
  stops: ["${stop1}", "${stop2}", "${stop3}"],
  affHotelsUrl: "${affHotelsUrl}",
  affToursUrl: "${affToursUrl}",
};
`;

  fs.writeFileSync(cityFile, cityFileContent, "utf8");

  const cityFiles = fs
    .readdirSync(cityDataDir)
    .filter((file) => file.endsWith(".ts"))
    .sort();

  const imports = cityFiles
    .map((file) => {
      const fileSlug = file.replace(".ts", "");
      const name = toVarName(fileSlug);
      return `import { ${name} } from "./city-data/${fileSlug}";`;
    })
    .join("\n");

  const listItems = cityFiles
    .map((file) => {
      const fileSlug = file.replace(".ts", "");
      return `  ${toVarName(fileSlug)},`;
    })
    .join("\n");

  const citiesContent = `import type { City } from "./types";

${imports}

const cityList: City[] = [
${listItems}
];

export const cities: Record<string, City> = Object.fromEntries(
  cityList.map((city) => [city.slug, city])
);
`;

  fs.writeFileSync(citiesFile, citiesContent, "utf8");

  console.log("");
  console.log(`Added city: ${city}, ${country}`);
  console.log(`Created: data/city-data/${slug}.ts`);
  console.log("Updated: data/cities.ts");
  console.log("");
  console.log(`Check: http://localhost:3000/c/${slug}?src=test&v=test_${slug}`);

  rl.close();
}

main();
