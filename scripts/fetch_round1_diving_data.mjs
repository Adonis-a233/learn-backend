/**
 * Maintainer-only baseline for the Java round-one task.
 *
 * The task no longer ships a data package: learners crawl the event data
 * themselves. This script keeps a maintainer-side reference snapshot for
 * spot-checking submissions, and must only be run after reviewing the source
 * site's terms and verifying that the returned data shape is unchanged.
 * It is not part of the learner task and is not linked from the task docs.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API_BASE = 'https://api.worldaquatics.com/fina';
const COMPETITION_ID = '5019';
const SCHEMA_VERSION = 1;
const REQUEST_DELAY_MS = 800;
const MAX_ATTEMPTS = 4;
const scriptDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)));
const defaultOutput = resolve(scriptDirectory, '../data/round-1-diving-2026');
const output = process.argv[2] ? resolve(process.argv[2]) : defaultOutput;

const sleep = milliseconds => new Promise(resolvePromise => setTimeout(resolvePromise, milliseconds));

async function fetchJson(path) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        headers: { 'user-agent': 'learn-backend-round1-data-maintainer/1.0' },
        signal: AbortSignal.timeout(30_000)
      });
      if (response.ok) return response.json();
      if (![429, 500, 502, 503, 504].includes(response.status) || attempt === MAX_ATTEMPTS) {
        throw new Error(`GET ${path} returned HTTP ${response.status}`);
      }
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) throw error;
    }
    await sleep(2 ** attempt * 1000);
  }
  throw new Error(`GET ${path} exhausted retries`);
}

function commandFor(discipline) {
  const eventType = discipline.Code.startsWith('2')
    ? 'synchronised'
    : discipline.Name === '10m' ? 'platform' : 'springboard';
  return `result ${discipline.Gender.toLowerCase()} ${discipline.Name} ${eventType}`;
}

function displayName(result) {
  if (result.Competitors?.length) {
    return [...result.Competitors]
      .sort((left, right) => `${left.LastName} ${left.FirstName}`.localeCompare(`${right.LastName} ${right.FirstName}`))
      .map(competitor => `${competitor.LastName ?? ''} ${competitor.FirstName ?? ''}`.trim())
      .join(' & ');
  }
  return result.FullName ?? `${result.LastName ?? ''} ${result.FirstName ?? ''}`.trim();
}

function normalizePlayers(groups) {
  const players = new Map();
  for (const group of groups) {
    for (const athlete of group.Participations ?? []) {
      if (athlete.Sports !== 'DV') continue;
      const gender = athlete.Gender === 0 ? 'Male' : 'Female';
      const fullName = `${athlete.PreferredLastName ?? ''} ${athlete.PreferredFirstName ?? ''}`.trim();
      players.set(`${fullName}|${gender}|${group.CountryCode}`, {
        fullName,
        gender,
        country: group.CountryName,
        countryCode: group.CountryCode
      });
    }
  }
  return [...players.values()].sort((left, right) =>
    left.country.localeCompare(right.country) || left.fullName.localeCompare(right.fullName)
  );
}

function normalizeEvent(discipline, eventData) {
  const final = eventData.Heats?.find(heat => heat.PhaseName === 'Finals');
  if (!final) throw new Error(`${discipline.Id} has no finals result`);
  const results = (final.Results ?? []).map(result => ({
    fullName: displayName(result),
    rank: result.Rank,
    countryCode: result.NAT,
    scores: (result.Dives ?? []).map(dive => dive.DivePoints),
    totalPoints: result.TotalPoints
  })).sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER));
  return {
    command: commandFor(discipline),
    eventId: discipline.Id,
    gender: discipline.Gender,
    discipline: discipline.Name,
    eventType: discipline.Code.startsWith('2') ? 'synchronised' : discipline.Name === '10m' ? 'platform' : 'springboard',
    results
  };
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

async function main() {
  await mkdir(output, { recursive: true });
  const competition = await fetchJson(`/competitions/${COMPETITION_ID}/events`);
  await sleep(REQUEST_DELAY_MS);
  const athletes = await fetchJson(`/competitions/${COMPETITION_ID}/athletes`);
  const diving = competition.Sports.find(sport => sport.Code === 'DV');
  if (!diving) throw new Error('The competition response contains no diving sport');

  const events = [];
  for (const discipline of diving.DisciplineList.filter(item => item.Gender === 'Men' || item.Gender === 'Women')) {
    await sleep(REQUEST_DELAY_MS);
    events.push(normalizeEvent(discipline, await fetchJson(`/events/${discipline.Id}`)));
  }

  const dataPath = resolve(output, 'data.json');
  await writeJson(dataPath, {
    schemaVersion: SCHEMA_VERSION,
    competition: {
      id: COMPETITION_ID,
      name: competition.OfficialName,
      from: competition.From.slice(0, 10),
      to: competition.To.slice(0, 10)
    },
    players: normalizePlayers(athletes),
    events: events.sort((left, right) => left.command.localeCompare(right.command))
  });
  await writeJson(resolve(output, 'manifest.json'), {
    schemaVersion: SCHEMA_VERSION,
    retrievedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    source: {
      provider: 'World Aquatics',
      competitionEndpoint: `${API_BASE}/competitions/${COMPETITION_ID}/events`,
      athletesEndpoint: `${API_BASE}/competitions/${COMPETITION_ID}/athletes`,
      eventEndpointTemplate: `${API_BASE}/events/{eventId}`
    },
    files: { 'data.json': { sha256: await sha256(dataPath) } }
  });
  console.log(`Wrote ${dataPath} and ${resolve(output, 'manifest.json')}`);
}

await main();
