#!/usr/bin/env node
/**
 * W1L2 Automaattitestit — CSS-perusteet
 *
 * Testaa:
 *   1. index.html linkittää style.css:n
 *   2. style.css sisältää vähintään 3 custom propertyä
 *   3. var()-funktio on käytössä
 *   4. nav a:hover -sääntö löytyy
 *   5. display: inline-block tai flex nav li/ul -säännöissä
 *   6. input/textarea:focus näkyy (outline ei ole none/0)
 *   7. nth-child-valitsin löytyy (taulukon vuorottelevat riviväriot)
 *   8. Nolla inline style-attribuutteja HTML:ssä
 *   9. Linkitetty tiedosto on style.css (eikä esim. styles.css)
 *  10. :root-lohko löytyy CSS:stä
 */

const fs   = require("fs");
const path = require("path");

// ── Tiedostot ────────────────────────────────────────────────────────────────
const htmlPath = path.join(__dirname, "..", "index.html");
const cssPath  = path.join(__dirname, "..", "style.css");

if (!fs.existsSync(htmlPath)) {
  console.error("VIRHE: index.html ei löydy repon juuresta.");
  process.exit(1);
}
if (!fs.existsSync(cssPath)) {
  console.error("VIRHE: style.css ei löydy repon juuresta.");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf-8");
const css  = fs.readFileSync(cssPath,  "utf-8");

// Poista kommentit CSS:stä analyysiä varten
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");

// ── Testikehys ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const results = [];

function test(description, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      passed++;
      results.push({ ok: true, desc: description });
    } else {
      failed++;
      results.push({ ok: false, desc: description, reason: String(result) });
    }
  } catch(e) {
    failed++;
    results.push({ ok: false, desc: description, reason: e.message });
  }
}

// ── TESTIT ───────────────────────────────────────────────────────────────────

// 1. Linkitys
test("index.html sisältää <link rel=\"stylesheet\" href=\"style.css\">", () => {
  const match = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/i)
             || html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/i);
  if (!match) return "Linkki-elementtiä ei löydy. Lisää <link rel=\"stylesheet\" href=\"style.css\"> head-elementtiin.";
  const href = match[1];
  if (href !== "style.css") return `href on "${href}" — pitäisi olla "style.css" (tarkista kirjoitusasu ja polku).`;
  return true;
});

// 2. :root-lohko
test("style.css sisältää :root { } -lohkon", () => {
  if (!/:root\s*\{/.test(css)) return ":root-lohkoa ei löydy. Lisää :root { } CSS-tiedoston alkuun.";
  return true;
});

// 3. Custom properties — vähintään 3
test("style.css määrittelee vähintään 3 CSS custom propertyä (--nimi: arvo)", () => {
  // Etsi :root-lohkosta custom property määrittelyt (--xxx: yyy;)
  const rootBlock = css.match(/:root\s*\{([^}]*)\}/s);
  if (!rootBlock) return ":root-lohkoa ei löydy.";
  const props = rootBlock[1].match(/--[\w-]+\s*:\s*[^;]+;/g) || [];
  if (props.length < 3) {
    return `Löytyi ${props.length} custom propertyä :root-lohkossa — tarvitaan vähintään 3.`;
  }
  return true;
});

// 4. var()-funktio käytössä
test("style.css käyttää var()-funktiota vähintään 2 kertaa", () => {
  const matches = cssNoComments.match(/var\s*\(\s*--[\w-]+/g) || [];
  if (matches.length < 2) {
    return `var() löytyy ${matches.length} kertaa — käytä custom propertyjäsi var():lla vähintään 2 ominaisuudessa.`;
  }
  return true;
});

// 5. nav a:hover
test("style.css sisältää nav a:hover -säännön", () => {
  if (!(/nav\s+a\s*:\s*hover/i.test(cssNoComments))) {
    return "nav a:hover -sääntöä ei löydy. Lisää hover-efekti navigaatiolinkeille.";
  }
  return true;
});

// 6. Navigaatiolinkit vaakaan (inline-block tai flex)
test("Navigaatio on asetettu vaakasuoraksi (inline-block tai flex)", () => {
  const hasInlineBlock = /nav\s+(li|ul)[^{]*\{[^}]*display\s*:\s*inline-block/is.test(cssNoComments)
                      || /nav\s+li[^{]*\{[^}]*display\s*:\s*inline-block/is.test(cssNoComments);
  const hasFlex        = /nav\s+(ul|ol)[^{]*\{[^}]*display\s*:\s*flex/is.test(cssNoComments)
                      || /nav[^{]*\{[^}]*display\s*:\s*flex/is.test(cssNoComments);
  if (!hasInlineBlock && !hasFlex) {
    return "Navigaation vaakasuoruus puuttuu. Lisää nav li { display: inline-block; } tai nav ul { display: flex; }.";
  }
  return true;
});

// 7. focus-outline — ei saa olla poistettuna
test("Lomake-kenttien focus-outline on näkyvä (ei outline: none tai 0)", () => {
  // Etsi input/textarea:focus säännöt
  const focusBlocks = cssNoComments.match(/(?:input|textarea|select)\s*:\s*focus[^{]*\{([^}]*)\}/gi) || [];
  if (focusBlocks.length === 0) {
    return "input:focus tai textarea:focus -sääntöä ei löydy. Lisää näkyvä focus-tyyli saavutettavuuden vuoksi.";
  }
  const blocksContent = focusBlocks.join("\n");
  if (/outline\s*:\s*(none|0)/i.test(blocksContent)) {
    return "outline: none tai outline: 0 poistaa näppäimistönavigoinnin visuaalisen indikaattorin — älä poista sitä!";
  }
  return true;
});

// 8. nth-child taulukkoväreihin
test("style.css käyttää :nth-child-valitsinta (taulukon vuorottelevat riviväriot)", () => {
  if (!/:nth-child/i.test(cssNoComments)) {
    return ":nth-child-valitsinta ei löydy. Lisää taulukon vuorottelevat riviväriot: tbody tr:nth-child(even) { background: ...; }";
  }
  return true;
});

// 9. Ei inline-tyylejä HTML:ssä
test("index.html ei sisällä inline style-attribuutteja", () => {
  // Etsi style="..." attribuutit (ei kuitenkaan <style>-elementtejä)
  const inlineStyles = html.match(/\bstyle\s*=\s*["'][^"']*["']/gi) || [];
  if (inlineStyles.length > 0) {
    return `Löytyi ${inlineStyles.length} inline style-attribuuttia. Siirrä kaikki tyylit style.css-tiedostoon. Löytyi: ${inlineStyles.slice(0,2).join(", ")}`;
  }
  return true;
});

// 10. Lomakkeen kentät täysleveät
test("Lomakkeen input/textarea-kenttien leveys on 100%", () => {
  const hasFullWidth = /(?:input|textarea|select)[^{]*\{[^}]*width\s*:\s*100%/is.test(cssNoComments)
                    || /input\[type[^\]]*\][^{]*\{[^}]*width\s*:\s*100%/is.test(cssNoComments);
  if (!hasFullWidth) {
    return "Lomakkeen kentillä ei ole width: 100%. Lisää se input, select ja textarea -säännöille.";
  }
  return true;
});

// ── Tulostus ──────────────────────────────────────────────────────────────────

console.log("\n" + "=".repeat(62));
console.log("  W1L2 — CSS Automaattitestit");
console.log("=".repeat(62) + "\n");

results.forEach(r => {
  const icon = r.ok ? "\x1b[32m PASS\x1b[0m" : "\x1b[31m FAIL\x1b[0m";
  console.log(`${icon}  ${r.desc}`);
  if (!r.ok && r.reason) {
    console.log(`       \x1b[33m=> ${r.reason}\x1b[0m`);
  }
});

console.log("\n" + "-".repeat(62));
console.log(`  Tulokset: ${passed} / ${passed + failed} testiä läpäisi`);
console.log("-".repeat(62) + "\n");

if (failed > 0) {
  console.log("\x1b[31mTestejä ei läpäissyt.\x1b[0m Korjaa yllä olevat virheet.\n");
  process.exit(1);
} else {
  console.log("\x1b[32mKaikki testit läpäisivät!\x1b[0m\n");
  process.exit(0);
}
