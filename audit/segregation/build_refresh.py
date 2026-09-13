#!/usr/bin/env python3
import json, re, csv, subprocess
from collections import defaultdict, Counter

REPO = "/home/claude/repo"
def sh(*a): return subprocess.check_output(list(a), cwd=REPO).decode().strip()

HEAD = sh("git","rev-parse","HEAD")
DICT_HASH = sh("git","hash-object","master_dictionary.json")
with open(f"{REPO}/master_dictionary.json", encoding="utf-8") as f:
    records = json.load(f)
N = len(records)

def norm(s):
    s = (s or "").replace("\u00b7","").replace(".","")
    return re.sub(r"\s+"," ",s).strip().lower()

eng_to_idx = defaultdict(list)
garo_to_idx = defaultdict(list)
for i,r in enumerate(records):
    eng_to_idx[norm(r.get("english"))].append(i)
    garo_to_idx[norm(r.get("garo"))].append(i)

shared_garo = {g:idxs for g,idxs in garo_to_idx.items() if g and len({norm(records[i].get("english")) for i in idxs})>1}
same_eng = {e:idxs for e,idxs in eng_to_idx.items() if e and len({norm(records[i].get("garo")) for i in idxs})>1}

# ---- CSV rows ----
rows = []
for g, idxs in shared_garo.items():
    for i in idxs:
        r = records[i]
        rows.append(("SHARED_GARO", g, len(idxs), i, r.get("english"), r.get("garo"), r.get("confidence"), (r.get("notes") or "")[:200]))
for e, idxs in same_eng.items():
    for i in idxs:
        r = records[i]
        rows.append(("SAME_ENGLISH_DIFF_GARO", e, len(idxs), i, r.get("english"), r.get("garo"), r.get("confidence"), (r.get("notes") or "")[:200]))
rows.sort(key=lambda r: (-r[2], r[0], r[1], r[3]))

with open(f"{REPO}/audit/segregation/CLAUDE_A_EVIDENCE_FULL.csv","w",newline="",encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["cluster_type","cluster_key","cluster_size","idx","english","garo","confidence","notes"])
    w.writerows(rows)

# ---- Section 3: generated counting forensics ----
numwords_sorted = ['sotbri','sotbonga','sotdok','sotsni','sotchet','sotsku','ritchasa','hajalsa',
                    'kolgrik','kolatchi','chiking','gittam','bonga','chet','sku','sni','dok','bri','gni','sa']
classifiers = ['sak','mang','rong','ge','bol','dam','dot','jol','king','kg','litre','pang','plate','roa','se','akka']
NUM_WORD_RE = re.compile(r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b", re.I)

gen_hits = []
for i,r in enumerate(records):
    e, g = r.get("english") or "", r.get("garo") or ""
    gl = g.lower()
    has_classifier = any(c in gl for c in classifiers)
    has_numsuffix = any(nw in gl for nw in numwords_sorted)
    has_engnum = bool(NUM_WORD_RE.search(e))
    if has_classifier and has_numsuffix and has_engnum:
        conf = (r.get("confidence") or "").lower()
        status = "explicitly superseded" if conf == "superseded" else \
                 "verified/high" if conf == "verified_high" else \
                 "unverified/OCR" if conf in ("unverified","ocr_flagged") else "mixed/unresolved"
        gen_hits.append({"idx": i, "english": e, "garo": g, "confidence": conf, "status": status})

gen_status_ctr = Counter(h["status"] for h in gen_hits)
gen_active = [h for h in gen_hits if h["confidence"] != "superseded"]

# ---- Section 4: superseded/verified coexistence ----
# cluster by normalized (english) within shared/same_eng populations, look for confidence mixes
coexist_clusters = []
for pop_name, pop in (("SHARED_GARO", shared_garo), ("SAME_ENGLISH_DIFF_GARO", same_eng)):
    for key, idxs in pop.items():
        confs = [(records[i].get("confidence") or "").lower() for i in idxs]
        has_verified = confs.count("verified_high")
        has_superseded = "superseded" in confs
        if has_verified >= 1 and has_superseded:
            coexist_clusters.append({"pop": pop_name, "key": key, "size": len(idxs),
                                      "verified_high_count": has_verified, "has_superseded": True,
                                      "idxs": idxs})

multi_verified_same_eng = {e: idxs for e, idxs in same_eng.items()
                            if sum(1 for i in idxs if (records[i].get("confidence") or "").lower()=="verified_high") >= 2}

# ---- Section 5: POS / orthography forensics ----
# crude POS heuristic: English gloss starting with "to " (verb) vs bare noun-looking gloss sharing same Garo
pos_conflict_clusters = []
for g, idxs in shared_garo.items():
    engs = [records[i].get("english") or "" for i in idxs]
    has_infinitive = any(e.strip().lower().startswith("to ") for e in engs)
    has_bare = any(not e.strip().lower().startswith("to ") and len(e.split())==1 for e in engs)
    if has_infinitive and has_bare:
        pos_conflict_clusters.append({"garo": g, "size": len(idxs), "idxs": idxs})

# orthography: raka/period mix, spacing, case (Garo side)
interpunct_period = [i for i,r in enumerate(records) if "\u00b7" in (r.get("garo") or "") and "." in (r.get("garo") or "")]
garo_space_groups = defaultdict(set)
for r in records:
    g = (r.get("garo") or "")
    garo_space_groups[g.replace(" ","").lower()].add(g)
space_variant_groups = {k:v for k,v in garo_space_groups.items() if len(v) > 1}
garo_case_groups = defaultdict(set)
for r in records:
    g = r.get("garo") or ""
    garo_case_groups[g.lower()].add(g)
garo_case_variant_groups = {k:v for k,v in garo_case_groups.items() if len(v) > 1}

# ---- P6: unverified/OCR-only backlog stats ----
conf_ctr = Counter((r.get("confidence") or "MISSING").lower() for r in records)

# ---- Priority tiers ----
P0 = multi_verified_same_eng  # same English, 2+ verified_high
P1 = {e: idxs for e, idxs in same_eng.items()
      if e not in P0 and sum(1 for i in idxs if (records[i].get("confidence") or "").lower()=="verified_high") >= 1
      and len({(records[i].get("confidence") or "").lower() for i in idxs}) > 1}
P2 = gen_active
P3 = coexist_clusters
P4 = pos_conflict_clusters
P5 = {"space_variant_groups": len(space_variant_groups), "garo_case_variant_groups": len(garo_case_variant_groups),
      "interpunct_period_mix": len(interpunct_period)}
P6 = conf_ctr

out = {
    "head": HEAD, "dict_hash": DICT_HASH, "record_count": N,
    "shared_garo_clusters": len(shared_garo), "shared_garo_records": sum(len(v) for v in shared_garo.values()),
    "same_eng_clusters": len(same_eng), "same_eng_records": sum(len(v) for v in same_eng.values()),
    "total_evidence_rows": len(rows),
    "gen_hits_total": len(gen_hits), "gen_status_breakdown": dict(gen_status_ctr),
    "gen_active_count": len(gen_active),
    "coexist_cluster_count": len(coexist_clusters),
    "P0_count": len(P0), "P1_count": len(P1), "P2_count": len(P2), "P3_count": len(P3), "P4_count": len(P4),
    "P5": P5, "P6": dict(P6),
}
print(json.dumps(out, indent=1, ensure_ascii=False))

with open(f"{REPO}/audit/segregation/refresh_stats.json","w",encoding="utf-8") as f:
    json.dump({
        **out,
        "P0_examples": {k: [records[i]["english"]+"|"+records[i]["garo"] for i in v[:6]] for k,v in list(P0.items())[:10]},
        "P1_examples": {k: [records[i]["english"]+"|"+records[i]["garo"]+"|"+str(records[i].get("confidence")) for i in v[:6]] for k,v in list(P1.items())[:10]},
        "P2_examples": gen_active[:15],
        "P3_examples": coexist_clusters[:10],
        "P4_examples": pos_conflict_clusters[:10],
    }, f, ensure_ascii=False, indent=1, default=str)
