/**
 * figureRuns — split a stat string into neutral vs accent runs, one rule used by
 * every metrics surface on the site. There is no resizing; accent only changes color.
 *
 * Rule:
 *  - Digits are always neutral.
 *  - "Special characters" — math/currency symbols (+ $ # % ×) and magnitude unit
 *    letters (M K B T) — are always accent.
 *  - A WORD (assets, days, screens, ...) is accent ONLY when the figure has no
 *    special character; if a special character is present it already carries the
 *    accent, so the word stays neutral.
 *  - Separators between/around numbers (- . , / space) stay neutral.
 *
 *    "300+ assets" -> 300 [+] assets      (the + is accent; assets neutral)
 *    "4 years"     -> 4 [years]           (no special char -> the word is accent)
 *    "11.7M"       -> 11.7 [M]
 *    "$75-150"     -> [$] 75-150
 *    "+2,115%"     -> [+] 2,115 [%]
 *    "40+ components" -> 40 [+] components
 */
const MAG = new Set(['M', 'K', 'B', 'T']);
const isSym = (ch: string) => '+$#%×→'.includes(ch);

export function figureRuns(s: string): { t: string; accent: boolean }[] {
  const tokens = s.match(/[0-9]+|[A-Za-z]+|[^0-9A-Za-z]+/g) ?? [];
  // A "special" indicator present anywhere means accompanying words stay neutral.
  const hasSpecial = tokens.some(
    (t) => [...t].some(isSym) || (/^[A-Za-z]+$/.test(t) && MAG.has(t)),
  );
  const out: { t: string; accent: boolean }[] = [];
  for (const t of tokens) {
    if (/^[0-9]+$/.test(t)) {
      out.push({ t, accent: false }); // a number
    } else if (/^[A-Za-z]+$/.test(t)) {
      // magnitude letter (M/K) is always accent; a real word is accent only with no special char
      out.push({ t, accent: MAG.has(t) ? true : !hasSpecial });
    } else {
      // symbol/space run: accent only the special characters, char by char
      for (const ch of t) out.push({ t: ch, accent: isSym(ch) });
    }
  }
  return out;
}
