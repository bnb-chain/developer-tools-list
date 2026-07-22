#!/usr/bin/env node
'use strict';

// Validates data.json: JSON syntax + entry schema.
// Zero dependencies — run with `npm run validate` or `node scripts/validate-data.js`.

const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] || path.join(__dirname, '..', 'data.json');
const REL = path.relative(process.cwd(), FILE) || FILE;

const isString = (v) => typeof v === 'string';
const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';
const isHttpUrl = (v) => typeof v === 'string' && /^https?:\/\/\S+$/.test(v.trim());
const isBoolean = (v) => typeof v === 'boolean';

// groupTitle/desc may be empty strings; logo may be empty or a data: URI.
const SCHEMA = {
  category: { required: true, check: isNonEmptyString, expect: 'a non-empty string' },
  groupTitle: { required: true, check: isString, expect: 'a string (may be empty)' },
  name: { required: true, check: isNonEmptyString, expect: 'a non-empty string' },
  desc: { required: true, check: isString, expect: 'a string (may be empty)' },
  website: { required: true, check: isHttpUrl, expect: 'an http(s):// URL' },
  chains: { required: true, check: isNonEmptyString, expect: 'a non-empty string' },
  logo: { required: false, check: isString, expect: 'a string' },
  annotations: { required: false, check: isNonEmptyString, expect: 'a non-empty string' },
  tags: { required: false, check: isNonEmptyString, expect: 'a non-empty string' },
  isSupportStaking: { required: false, check: isBoolean, expect: 'a boolean' },
};

const errors = [];
const warnings = [];

function show(v) {
  const s = JSON.stringify(v);
  return s === undefined ? String(v) : s.length > 80 ? s.slice(0, 77) + '...' : s;
}

let raw;
try {
  raw = fs.readFileSync(FILE, 'utf8');
} catch (e) {
  fail([`cannot read ${REL}: ${e.message}`]);
}

if (raw.charCodeAt(0) === 0xfeff) {
  errors.push('file must not start with a UTF-8 BOM');
  raw = raw.slice(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  errors.push(`invalid JSON: ${e.message}`);
  fail(errors);
}

if (!Array.isArray(data)) {
  errors.push(`top-level value must be an array, got ${typeof data}`);
  fail(errors);
}

const seen = new Map();
data.forEach((entry, i) => {
  const label = `entry[${i}]` + (entry && isNonEmptyString(entry.name) ? ` "${entry.name}"` : '');

  if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
    errors.push(`${label}: must be an object, got ${show(entry)}`);
    return;
  }

  for (const [field, rule] of Object.entries(SCHEMA)) {
    if (!(field in entry)) {
      if (rule.required) errors.push(`${label}: missing required field "${field}"`);
      continue;
    }
    if (!rule.check(entry[field])) {
      errors.push(`${label}: "${field}" must be ${rule.expect}, got ${show(entry[field])}`);
    }
  }

  const unknown = Object.keys(entry).filter((k) => !(k in SCHEMA));
  if (unknown.length) {
    errors.push(
      `${label}: unknown field(s) ${unknown.map(show).join(', ')} — allowed fields: ${Object.keys(SCHEMA).join(', ')}`
    );
  }

  if (isNonEmptyString(entry.category) && isNonEmptyString(entry.name)) {
    const key = `${entry.category.trim().toLowerCase()}|${entry.name.trim().toLowerCase()}`;
    if (seen.has(key)) {
      warnings.push(`${label}: duplicates entry[${seen.get(key)}] (same category + name)`);
    } else {
      seen.set(key, i);
    }
  }
});

for (const w of warnings) {
  console.log(`WARNING: ${w}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::warning file=data.json::${w}`);
}

if (errors.length) fail(errors);
console.log(`OK: ${REL} is valid (${data.length} entries, ${warnings.length} warning(s))`);

function fail(msgs) {
  for (const m of msgs) {
    console.error(`ERROR: ${m}`);
    if (process.env.GITHUB_ACTIONS) console.log(`::error file=data.json::${m}`);
  }
  console.error(`\n${REL} validation failed with ${msgs.length} error(s)`);
  process.exit(1);
}
