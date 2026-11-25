/**
 * Asset variant guard: X.vi.<ext> must pair with X.<ext> and share the same
 * pixel dimensions. Mismatches are resized to match the base.
 *
 * Why: .vi.<ext> is the Vietnamese-localized version of an asset. Both render
 * in the same UI slot, so a dimension mismatch makes the layout jump when the
 * user flips language. Type checks can't see this, and a 2px difference is
 * invisible until you actually switch locales.
 *
 * Behavior:
 *   - Default (fix): every .vi.<ext> whose size differs from its base X.<ext>
 *     is resized in place to the base's dimensions. Atomic write (tmp + rename).
 *   - --check: read-only; report mismatches and exit 1 (for prepack / CI).
 *   - X.vi.<ext> without X.<ext>: hard error (can't resize to nothing).
 *   - X.<ext> without X.vi.<ext>: fine unless --require-base.
 *
 * Options:
 *   --check                  Read-only; exit 1 on any warning
 *   --json                   Machine-readable output
 *   --fit=fill|cover|contain Resize strategy (default: fill = exact match)
 *   --size=N                 Also require every image to be exactly NxN
 *   --locales=vi,ja,...      Locale codes to treat as variants (default: vi)
 *   --require-base           Also require X.vi.<ext> for every X.<ext>
 *
 * Dependency: sharp (npm i -D sharp)
 *
 * Usage:
 *   node scripts/check-asset-size.mjs
 *   node scripts/check-asset-size.mjs --check
 *   node scripts/check-asset-size.mjs --check --json
 */
import fs from 'node:fs';
import path from 'node:path';

let sharp;
try {
    sharp = (await import('sharp')).default;
} catch {
    console.error('[check-asset-size] ✗ Missing dependency sharp. Run `npm i -D sharp` first.');
    process.exit(2);
}

const ASSETS = 'assets';
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;
const FITS = { fill: sharp.fit.fill, cover: sharp.fit.cover, contain: sharp.fit.contain };

function parseArgs(argv) {
    const opts = {
        check: false,
        json: false,
        fit: 'fill',
        size: null,
        requireBase: false,
        locales: ['vi'],
    };
    for (const a of argv.slice(2)) {
        if (a === '--check') opts.check = true;
        else if (a === '--json') opts.json = true;
        else if (a === '--require-base') opts.requireBase = true;
        else if (a.startsWith('--fit=')) {
            const v = a.slice('--fit='.length);
            if (!(v in FITS)) {
                console.error(`[check-asset-size] Unknown --fit=${v}. Allowed: ${Object.keys(FITS).join('|')}`);
                process.exit(2);
            }
            opts.fit = v;
        } else if (a.startsWith('--size=')) {
            const n = Number(a.slice('--size='.length));
            if (!Number.isInteger(n) || n <= 0) {
                console.error('[check-asset-size] --size must be a positive integer');
                process.exit(2);
            }
            opts.size = n;
        } else if (a.startsWith('--locales=')) {
            opts.locales = a.slice('--locales='.length).split(',').map((s) => s.trim()).filter(Boolean);
            if (opts.locales.length === 0) {
                console.error('[check-asset-size] --locales needs at least one code');
                process.exit(2);
            }
        } else {
            console.error(`[check-asset-size] Unknown argument: ${a}`);
            process.exit(2);
        }
    }
    return opts;
}

function collect(dir) {
    if (!fs.existsSync(dir)) return [];
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...collect(full));
        else if (IMAGE_EXT.test(entry.name)) out.push(full.replace(/\\/g, '/'));
    }
    return out;
}

async function dims(file) {
    try {
        const meta = await sharp(file).metadata();
        if (!meta.width || !meta.height) return { error: 'cannot read dimensions' };
        if ((meta.pages ?? 1) > 1) return { error: 'animated image, skipped', animated: true };
        return { width: meta.width, height: meta.height, format: meta.format };
    } catch (err) {
        return { error: String(err?.message ?? err) };
    }
}

/** Resize `file` to exactly `target` dims. Atomic: tmp + rename. */
async function resizeTo(file, target, fitName, format) {
    let background;
    if (fitName === 'contain') {
        background = format === 'jpeg' ? '#ffffff' : { r: 0, g: 0, b: 0, alpha: 0 };
    }
    const buf = await sharp(file)
        .resize(target.width, target.height, { fit: FITS[fitName], position: 'centre', background })
        .toBuffer();

    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    try {
        fs.writeFileSync(tmp, buf);
        fs.renameSync(tmp, file);
    } catch (err) {
        try { fs.unlinkSync(tmp); } catch { }
        throw err;
    }
}

const opts = parseArgs(process.argv);
const files = collect(ASSETS);
const fileSet = new Set(files);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const VARIANT_RE = new RegExp(`\\.(${opts.locales.map(escapeRe).join('|')})\\.(png|jpe?g|webp)$`, 'i');

// Group files by base path.
const pairs = new Map();
for (const f of files) {
    const m = f.match(VARIANT_RE);
    if (m) {
        const ext = m[2];
        const locale = m[1].toLowerCase();
        const base = f.slice(0, f.length - m[0].length) + '.' + ext;
        if (!pairs.has(base)) pairs.set(base, { base, variants: [] });
        pairs.get(base).variants.push({ locale, file: f });
    } else if (!pairs.has(f)) {
        pairs.set(f, { base: f, variants: [] });
    }
}

const results = [];
const rel = (f) => path.relative(process.cwd(), f);

for (const { base, variants } of pairs.values()) {
    const baseExists = fileSet.has(base);

    if (!baseExists && variants.length > 0) {
        for (const v of variants) {
            results.push({
                kind: 'missing-base',
                file: v.file,
                message: `${rel(v.file)}: no base "${rel(base)}" to match`,
            });
        }
        continue;
    }
    if (!baseExists) continue;

    if (opts.requireBase && variants.length === 0) {
        results.push({
            kind: 'missing-variant',
            file: base,
            message: `${rel(base)}: no ${opts.locales.join('/')} variant`,
        });
    }

    if (variants.length === 0) continue;

    const bd = await dims(base);
    if (bd.error) {
        results.push({ kind: 'unreadable', file: base, message: `${rel(base)}: ${bd.error}` });
        continue;
    }

    for (const v of variants) {
        const vd = await dims(v.file);
        if (vd.error) {
            results.push({
                kind: vd.animated ? 'skipped' : 'unreadable',
                file: v.file,
                message: `${rel(v.file)}: ${vd.error}`,
            });
            continue;
        }

        const same = vd.width === bd.width && vd.height === bd.height;
        if (same) {
            results.push({ kind: 'ok', file: v.file });
            continue;
        }

        const from = `${vd.width}x${vd.height}`;
        const to = `${bd.width}x${bd.height}`;

        if (opts.check) {
            results.push({
                kind: 'mismatch',
                file: v.file,
                message: `${rel(v.file)}: ${from} ≠ base ${rel(base)} ${to}`,
            });
            continue;
        }

        try {
            await resizeTo(v.file, bd, opts.fit, vd.format);
            results.push({
                kind: 'resized',
                file: v.file,
                message: `${rel(v.file)}: ${from} → ${to} (match ${rel(base)}, ${opts.fit})`,
            });
        } catch (err) {
            results.push({
                kind: 'resize-failed',
                file: v.file,
                message: `${rel(v.file)}: resize failed — ${String(err?.message ?? err)}`,
            });
        }
    }
}

// Optional: strict size assertion.
if (opts.size != null) {
    const n = opts.size;
    for (const f of files) {
        const d = await dims(f);
        if (d.error) continue;
        if (d.width !== n || d.height !== n) {
            results.push({
                kind: 'wrong-size',
                file: f,
                message: `${rel(f)}: ${d.width}x${d.height} (expected ${n}x${n})`,
            });
        }
    }
}

const hardKinds = new Set(['missing-base', 'missing-variant', 'unreadable', 'resize-failed', 'wrong-size']);
const hasHardError = results.some((r) => hardKinds.has(r.kind));
const hasMismatch = results.some((r) => r.kind === 'mismatch');
const hasWarning = hasHardError || hasMismatch;

const summary = results.reduce(
    (acc, r) => {
        acc[r.kind] = (acc[r.kind] ?? 0) + 1;
        return acc;
    },
    {},
);

if (opts.json) {
    console.log(
        JSON.stringify(
            {
                mode: opts.check ? 'check' : 'fix',
                fit: opts.fit,
                files: files.length,
                variants: [...pairs.values()].reduce((n, p) => n + p.variants.length, 0),
                summary,
                results,
            },
            null,
            2,
        ),
    );
} else {
    for (const r of results) {
        if (r.kind === 'ok' || r.kind === 'skipped') continue;
        if (r.kind === 'mismatch') console.warn(`  ! ${r.message}`);
        else if (r.kind === 'resized') console.log(`  ↻ ${r.message}`);
        else console.error(`  ✗ ${r.message}`);
    }

    const parts = [`${files.length} 张图`];
    if (summary.variants) parts.push(`${summary.variants} 个变体`);
    if (summary.resized) parts.push(`已重采样 ${summary.resized}`);
    if (summary.ok) parts.push(`一致 ${summary.ok}`);
    if (summary.mismatch) parts.push(`尺寸不符 ${summary.mismatch}`);
    if (summary.skipped) parts.push(`跳过动图 ${summary.skipped}`);
    if (hasHardError) parts.push(`错误 ${results.filter((r) => hardKinds.has(r.kind)).length}`);

    const prefix = '[check-asset-size]';
    if (opts.check && hasWarning) console.error(`${prefix} ✗ ${parts.join('，')}`);
    else if (hasHardError) console.error(`${prefix} ✗ ${parts.join('，')}`);
    else console.log(`${prefix} ✓ ${parts.join('，')}`);
}

if (opts.check && hasWarning) process.exit(1);
if (hasHardError) process.exit(1);