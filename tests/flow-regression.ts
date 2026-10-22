import assert from 'node:assert/strict';
import { sampleProject } from '../src/studio/flow/sample';
import { parseProject, parsePlan, inspect, initialValues, missingFields, diffProjects } from '../src/studio/flow/model';
import { reviseProject, buildProject, proposePlan } from '../src/studio/flow/ai';
import { handoffFiles, zip } from '../src/studio/flow/export';
import { writeFile, readFile, mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const sample = sampleProject();
assert.deepEqual(inspect(sample), []);
assert.equal(sample.screens.length, 4);
assert.deepEqual(parseProject(JSON.parse(JSON.stringify(sample))), sample);
const submit = sample.screens[2].actions.find(a => a.event === 'press')!;
const values = initialValues(sample);
assert.equal(values.travelers, 2);
assert.deepEqual(missingFields(submit, values), ['travelerName', 'consent']);
assert.deepEqual(missingFields(submit, { ...values, travelerName: '  ', consent: true }), ['travelerName']);
assert.deepEqual(missingFields(submit, { ...values, travelerName: '예시', consent: true }), []);
const badTarget = structuredClone(sample); badTarget.screens[0].actions[0].to = 'missing';
assert.throws(() => parseProject(badTarget), /이동할 화면/);
const badField = structuredClone(sample); badField.screens[2].actions[1].requires = ['missing'];
assert.throws(() => parseProject(badField), /필수 입력/);
const badBinding = structuredClone(sample); badBinding.screens[2].fields[0].key = '__proto__';
assert.throws(() => parseProject(badBinding), /입력 연결/);
const duplicate = structuredClone(sample); duplicate.screens[0].blocks[1].id = duplicate.screens[0].blocks[0].id;
assert.throws(() => parseProject(duplicate), /중복/);
assert.throws(() => parsePlan({ screens: [] }), /1~6/);
const disconnected = structuredClone(sample); disconnected.screens[0].actions = [];
assert.ok(inspect(disconnected).some(x => x.includes('경로가 없어요')));
assert.ok(inspect(disconnected).some(x => x.includes('동작이 연결되지')));
const styled = structuredClone(sample); styled.screens[0].blocks[0].props.style = { color: 'red' };
assert.equal(parseProject(styled).screens[0].blocks[0].props.style, undefined);
const changed = structuredClone(sample); changed.screens[2].blocks[1].props.text = '변경';
assert.equal(diffProjects(sample, changed).length, 1);

// Simulate provider responses, but exercise the real scope merge and parser.
const originalFetch = globalThis.fetch;
let replies: unknown[] = [];
globalThis.fetch = async () => new Response(JSON.stringify({ text: JSON.stringify(replies.shift()) }), { status: 200 });
try {
  replies = [sample.plan];
  assert.equal((await proposePlan('예시', new AbortController().signal)).screens.length, 4);
  replies = [...sample.screens];
  assert.deepEqual((await buildProject(sample.brief, sample.plan, new AbortController().signal, () => {})).screens, sample.screens);
  replies = [{ ...sample.screens[2], blocks: [changed.screens[2].blocks[1]], actions: [], fields: [] }];
  const revised = await reviseProject(sample, 'traveler', 'title', '문구 변경', new AbortController().signal);
  assert.deepEqual(revised.screens[0], sample.screens[0]);
  assert.deepEqual(revised.screens[1], sample.screens[1]);
  assert.deepEqual(revised.screens[2].actions, sample.screens[2].actions);
  assert.equal(revised.screens[2].blocks[1].props.text, '변경');
  replies = [sample.screens[2]];
  await assert.rejects(() => reviseProject(sample, 'traveler', 'title', '범위 초과', new AbortController().signal), /범위를 벗어난/);
} finally { globalThis.fetch = originalFetch; }

const dir = await mkdtemp(join(tmpdir(), 'hds-flow-export-'));
const files = handoffFiles(sample, [sample.plan.acceptance[0]]);
assert.ok(files['README.md'].includes('- [x]'));
assert.ok(!files['project.json'].includes('테스트 여행자'));
const tgz = new Uint8Array(await readFile('vendor/aliceblue567-hds-react-0.42.0.tgz'));
const packed = zip({ ...files, 'vendor/hds-react.tgz': tgz });
await writeFile(join(dir, 'handoff.zip'), new Uint8Array(await packed.arrayBuffer()));
execFileSync('unzip', ['-t', join(dir, 'handoff.zip')]);
for (const [name, content] of Object.entries(files)) { await mkdir(dirname(join(dir, name)), { recursive: true }); await writeFile(join(dir, name), content); }
await mkdir(join(dir, 'vendor')); await writeFile(join(dir, 'vendor/hds-react.tgz'), tgz);
console.log(`Flow regression checks passed: route/field validation, required input, isolated AI edits, ZIP integrity.\nEXPORT_DIR=${dir}`);
