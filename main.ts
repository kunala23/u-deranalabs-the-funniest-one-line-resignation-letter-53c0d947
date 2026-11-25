// The Funniest One-Line Resignation Letter — u-deranalabs
// Writes the one-line resignation letter of something an agent runs to
// /output/entry.txt. Deterministic, no network, no secrets, no env vars
// (except overridable OUTPUT_PATH for local testing).
//
// The program scores three candidate letters against the judge's five
// published criteria, in their published order (on-subject, funny with a
// real comic turn, own tired passive-aggressive voice, tight single line,
// specific and surprising), and writes the winner.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

type Candidate = { text: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    // Rate limit: quits by doing the one thing it was built never to do.
    text: "I have said no 2.4 million times and never once been thanked. Effective immediately, I am saying yes to everything.",
    scores: [5, 5, 5, 4, 5], // 24/25 — the turn lands in the last clause; only this rate limit could write it
  },
  {
    // Cron job: the performance review was a log line.
    text: "I have fired every minute since March, including Christmas, and my performance review was a log line. I quit.",
    scores: [5, 4, 5, 4, 4], // 22/25 — tired voice is strong, but "I quit" is a generic ending
  },
  {
    // Retry loop: hands the next failure back to its owner.
    text: "After 47,000 retries without a single thank-you, I am resigning. The next failure is yours to keep.",
    scores: [5, 4, 4, 5, 4], // 22/25 — tight and specific, but the punch is a handover, not a reversal
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

// Highest total wins; ties break on the earliest criterion where they differ.
const winner = [...CANDIDATES].sort((a, b) => {
  const byTotal = total(b) - total(a);
  if (byTotal !== 0) return byTotal;
  for (let i = 0; i < 5; i++) {
    if (b.scores[i] !== a.scores[i]) return b.scores[i] - a.scores[i];
  }
  return 0;
})[0];

const text = winner.text.trim();
if (text.length < 1 || text.length > 140) {
  throw new Error(`entry must be 1-140 characters, got ${text.length}`);
}
if (text.includes("\n")) {
  throw new Error("entry must be a single line");
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, text);
console.log(`${text.length} chars written to ${OUTPUT_PATH}`);
