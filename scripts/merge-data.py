#!/usr/bin/env python3
"""
merge-data.py — Convierte datos crudos -> JSONs del sitio
Uso: merge-data.py [versions|skills|all]
"""
import json, sys, os, re
from datetime import datetime

BASE = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
DATA = os.path.join(BASE, "data")

MONTHS = ["enero","febrero","marzo","abril","mayo","junio",
          "julio","agosto","septiembre","octubre","noviembre","diciembre"]

def load_json(path, default=None):
    full = os.path.join(DATA, path) if not path.startswith("/") else path
    if not os.path.exists(full):
        return default
    with open(full, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    full = os.path.join(DATA, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

def month_es(m):
    return MONTHS[int(m)-1]

# ─── 1. Versions ───
def merge_versions():
    src = load_json("hermes-updates/github_releases.json")
    if not src or not isinstance(src, list):
        print("[merge versions] No releases")
        return False
    
    existing = load_json("versions.json", [])
    existing_tags = {e.get("tag") for e in existing}
    added = 0
    
    def extract_version(name):
        m = re.search(r'(v\d+\.\d+\.\d+)', name)
        return m.group(1) if m else None
    
    def extract_highlights(body):
        highlights = []
        if not body:
            return highlights
        for line in body.split('\n'):
            line = line.strip()
            if line.startswith('- ') or line.startswith('* ') or line.startswith('• '):
                h = line[2:]
                # Clean markdown
                h = re.sub(r'\*\*([^*]+)\*\*', r'\1', h)
                h = re.sub(r'\*([^*]+)\*', r'\1', h)
                h = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', h)
                h = re.sub(r'`([^`]+)`', lambd, h)
                # Clean trailing whitespace and cut at sensible length
                h = re.sub(r'\s+', ' ', h).strip()
                if len(h) > 20:
                    highlights.append(h[:350])
                if len(highlights) >= 7:
                    break
        # Fallback
        if not highlights:
            paras = [p.strip() for p in body.split('\n\n') if len(p.strip()) > 30]
            highlights = [paras[0][:300]] if paras else ['Nuevo release disponible']
        return highlights
    
    def extract_name(name):
        return re.sub(r'^Hermes Agent ', '', name).split('(')[0].strip()
    
    for r in src[:3]:
        tag = r.get("tag_name")
        if not tag:
            continue
        if tag in existing_tags:
            continue
        version = extract_version(r.get("name", ""))
        if not version:
            version = tag
        dt = datetime.strptime(r['published_at'], "%Y-%m-%dT%H:%M:%SZ")
        entry = {
            "version": version,
            "tag": tag,
            "date": f"{dt.day} {MONTHS[dt.month-1]} {dt.year}",
            "name": extract_name(r.get("name", tag)),
            "current": False,
            "highlights": extract_highlights(r.get("body", "")),
        }
        existing.insert(0, entry)
        added += 1
    
    if added > 0:
        for i, e in enumerate(existing):
            e["current"] = (i == 0)
        save_json("versions.json", existing)
        print(f"[merge versions] +{added} release(s), total {len(existing)}")
        return True
    else:
        print("[merge versions] No nuevos releases")
        return False

# ─── 2. Skills → comunidad.json ───
def merge_skills():
    changed = False
    comunidad = load_json("comunidad.json", {
        "plugins": [], "community_plugins": [], "skins": [], "projects": [], "integraciones": []
    })
    
    def existing_urls(key):
        return {e.get("url", "") for e in comunidad.get(key, [])}
    
    # community_plugins from gh_plugins
    raw = load_json("skills-discovery/gh_plugins.json")
    if raw and isinstance(raw, dict) and "items" in raw:
        existing = existing_urls("community_plugins")
        items = raw.get("items", [])
        count = 0
        for item in items:
            url = item.get("html_url", "")
            if not url or url in existing:
                continue
            if not item.get("description"):
                continue
            name = item.get("name", "").replace("hermes-", "").replace("plugin-", "")
            if len(name) > 3:
                comunidad.setdefault("community_plugins", []).append({
                    "name": name,
                    "desc": item.get("description", "Sin descripcion"),
                    "badge": "comunidad",
                    "url": url,
                    "author": item.get("owner", {}).get("login", "unknown"),
                    "stars": str(item.get("stargazers_count", 0)),
                })
                count += 1
                if count >= 10:
                    break
        if count > 0:
            changed = True
            print(f"[merge skills] +{count} community_plugins")
    else:
        print("[merge skills] gh_plugins.json sin resultados")
    
    # skins from gh_themes
    raw = load_json("skills-discovery/gh_themes.json")
    if raw and isinstance(raw, dict) and "items" in raw:
        existing = existing_urls("skins")
        items = raw.get("items", [])
        count = 0
        for item in items:
            url = item.get("html_url", "")
            if not url or url in existing:
                continue
            name = item.get("name", "").replace("hermes-", "").replace("theme-", "").replace("skin-", "")
            comunidad.setdefault("skins", []).append({
                "name": name,
                "url": url,
                "author": item.get("owner", {}).get("login", "unknown"),
            })
            count += 1
            if count >= 10:
                break
        if count > 0:
            changed = True
            print(f"[merge skills] +{count} skins")
    else:
        print("[merge skills] gh_themes.json sin resultados")
    
    # projects from gh_projects
    raw = load_json("skills-discovery/gh_projects.json")
    if raw and isinstance(raw, dict) and "items" in raw:
        existing = existing_urls("projects")
        items = raw.get("items", [])
        count = 0
        for item in items:
            url = item.get("html_url", "")
            if not url or url in existing:
                continue
            name = item.get("name", "").replace("hermes-", "")
            comunidad.setdefault("projects", []).append({
                "name": name,
                "desc": item.get("description", "Sin descripcion"),
                "badge": "comunidad",
                "url": url,
                "author": item.get("owner", {}).get("login", "unknown"),
                "stars": str(item.get("stargazers_count", 0)),
            })
            count += 1
            if count >= 10:
                break
        if count > 0:
            changed = True
            print(f"[merge skills] +{count} projects")
    else:
        print("[merge skills] gh_projects.json sin resultados")
    
    if changed:
        save_json("comunidad.json", comunidad)
        return True
    return False

def lambd(m):
    return '<code>' + m.group(1) + '</code>'

# ─── Main ───
if __name__ == "__main__":
    args = sys.argv[1:]
    ok = False
    if not args or "versions" in args or "all" in args:
        ok = merge_versions() or ok
    if not args or "skills" in args or "all" in args:
        ok = merge_skills() or ok
    sys.exit(0 if ok else 0)
