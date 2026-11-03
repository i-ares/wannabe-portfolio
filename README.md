# wannabe-portfolio

**The People vs. Soham Bhar.** An interactive courtroom portfolio. You are Juror Twelve, the charge is being "suspiciously employable", and every project takes the stand. Built for the Wispr Flow hiring challenge.

The failures are on the record too: a removed Pave privacy-zones feature, a hardware startup that never launched, an abandoned side project, and a hardcoded WiFi password. Each charge gets cross-examined, each project gets an evidence file, and the verdict is up to you.

## What is inside
- **Trial flow:** title, arraignment, opening statements, prosecution (4 counts), defence (4 exhibits), evidence locker, verdict.
- **Evidence files:** a full case file per exhibit (Pave, F1 Terminal, M5Paper reader, VISN) with photos, clips and a witness statement.
- **Filing cabinet:** supporting documents with an admit/sustain objection moment. Documents without proof are labelled "testimony only".
- **Fast path:** `/?speedrun=1` (under 90 seconds), `/?index=1` (case index), `/?file=pave|f1|m5|visn`, `/?cabinet=1`.
- **Voice:** the answers are spoken. The defendant is a clone of the author's own voice; judge and prosecutor are synthetic. Build-log videos are clearly labelled reconstructions.

## Stack
Plain HTML, CSS and JavaScript. No build step, no dependencies. Videos were rendered with HyperFrames, voices with a local OmniVoice setup.

## Run it
```
python3 -m http.server 8765
```
Open http://127.0.0.1:8765/ (use a real server, not `file://`).

## Files
- `content.js`: all trial copy and clip ids. `files.js`: evidence files and cabinet data.
- `app.js`: the trial flow and UI. `dossier.js`: evidence viewers, cabinet, index, speed-run.
- `site.css`: editorial shell. `evidence.css`: evidence-file and cabinet styling.
- `audio/`: spoken clips. `assets/`: videos, images, proof documents (redacted copies only).
- `SCRIPT.md`, `RECORDING-SHEET.md`: every spoken line. `tools/docs-manifest.py`: rebuilds the proof manifest.
- `_legacy/`: the earlier 8-bit shell, kept for reference.

## Notes
Personal documents in `assets/docs/` are redacted copies. Original files are not in this repository.
