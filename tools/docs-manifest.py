"""Lists the proof files in assets/docs so the site knows which documents are ON FILE.
Run after adding or removing a proof image/video:  python3 tools/docs-manifest.py"""
import json, os
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'docs')
files = sorted(f for f in os.listdir(d) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.mp4')))
json.dump({'files': files}, open(os.path.join(d, 'manifest.json'), 'w'), indent=1)
print(len(files), 'proof files listed in assets/docs/manifest.json')
