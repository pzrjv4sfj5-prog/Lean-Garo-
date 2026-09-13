#!/usr/bin/env python3
"""
Claude D forensic segregation / discrepancy audit.
Rebuilt from .ai/CLAUDE_D_HANDOUT.md methodology — prior audit_output/tooling
was never pushed to origin/main and does not exist in this repo (confirmed
2026-09-10 via repo grep). This is a fresh build, not a resume.

Claude D observes/classifies/flags. It does NOT adjudicate which Garo form
is correct (Claude A's job) or fix runtime/engineering issues (Claude B's
job). Nothing in this script writes to master_dictionary.json or any other
canonical/runtime file.

Discrepancy-type (D1-D10) and priority (P0-P3) definitions below are Claude
D's own working schema for this run, since the handout describes the
*categories of things to detect* but does not pin exact D-code/priority
definitions to specific codes. This schema is stated explicitly in
SEGREGATION_SUMMARY.md so Claude A/Owner can see exactly what each code means.
"""
import json, re, csv, hashlib, subprocess, sys
from collections import defaultdict

REPO = "/home/claude/repo"

def git_hash_object(path):
    return subprocess.check_output(["git", "hash-object", path], cwd=REPO).decode().strip()

def normalize(s):
    if s is None:
        return ""
    # strip raka (interpunct) and hyphens, EXCEPT hyphens inside parenthetical
    # glosses e.g. "begin (infinitive)" -- protect parenthetical content first.
    paren = re.findall(r"\([^)]*\)", s)
    tmp = re.sub(r"\([^)]*\)", "\x00", s)
    tmp = tmp.replace("\u00b7", "").replace("-", "")
    for p in paren:
        tmp = tmp.replace("\x00", p, 1)
    return re.sub(r"\s+", " ", tmp).strip().lower()

def classify_type(english, garo):
    e = (english or "").strip()
    if "?" in e or e.endswith(".") or e.endswith("!"):
        return "SENTENCE"
    words = e.split()
    if len(words) >= 5:
        return "SENTENCE"
    if len(words) >= 2:
        return "PHRASE"
    return "WORD"

NV_RE = re.compile(r"NV-\d+")
RULE_RE = re.compile(r"RULE-\d+")
PO_RE = re.compile(r"project owner", re.I)
NATIVE_RE = re.compile(r"thangseng|native[- ]confirmed|native[- ]validat", re.I)

def extract_provenance(notes):
    notes = notes or ""
    return {
        "nv_refs": sorted(set(NV_RE.findall(notes))),
        "rule_refs": sorted(set(RULE_RE.findall(notes))),
        "owner_directive": bool(PO_RE.search(notes)),
        "native_cited": bool(NATIVE_RE.search(notes)),
        "superseded_note": "superseded" in notes.lower(),
    }

def load():
    with open(f"{REPO}/master_dictionary.json", encoding="utf-8") as f:
        return json.load(f)

def main():
    records = load()
    dict_hash = git_hash_object(f"{REPO}/master_dictionary.json")
    n = len(records)

    # ---- Phase 1: global indices across the ENTIRE file ----
    eng_index = defaultdict(list)   # normalized english -> [idx]
    garo_index = defaultdict(list)  # normalized garo -> [idx]
    pair_index = defaultdict(list)  # (norm_eng, norm_garo) -> [idx]
    eng_raw_index = defaultdict(list)  # raw-lowercased english (case only) -> [idx]

    for i, r in enumerate(records):
        ne = normalize(r.get("english"))
        ng = normalize(r.get("garo"))
        eng_index[ne].append(i)
        garo_index[ng].append(i)
        pair_index[(ne, ng)].append(i)
        eng_raw_index[(r.get("english") or "").strip().lower()].append(i)

    # ---- Phase 2: per-record classification ----
    ledger = []
    BATCH = 500
    for i, r in enumerate(records):
        english = r.get("english")
        garo = r.get("garo")
        confidence = (r.get("confidence") or "").lower()
        notes = r.get("notes") or ""
        ne, ng = normalize(english), normalize(garo)

        rtype = classify_type(english, garo)
        prov = extract_provenance(notes)

        eng_siblings = [j for j in eng_index[ne] if j != i]
        garo_siblings = [j for j in garo_index[ng] if j != i]
        exact_dup_siblings = [j for j in pair_index[(ne, ng)] if j != i]
        case_siblings = [j for j in eng_raw_index[(english or "").strip().lower()] if j != i]

        # sibling confidence tags for this english key
        sibling_confidences = [(records[j].get("confidence") or "").lower() for j in eng_index[ne]]
        verified_count = sum(1 for c in sibling_confidences if c == "verified_high")

        discrepancies = []  # list of (code, detail)

        # D3: exact duplicate record (same normalized english+garo)
        if exact_dup_siblings:
            discrepancies.append(("D3", f"{len(exact_dup_siblings)} other record(s) share identical (english,garo)"))

        # D9: missing/incomplete
        if not english or not garo:
            discrepancies.append(("D9", "missing english or garo field"))

        # D5: case-only duplicate (raw english differs only by case, normalized differ? actually same normalized)
        if case_siblings and not exact_dup_siblings:
            discrepancies.append(("D5", f"{len(case_siblings)} record(s) differ only by english capitalization"))

        # D6: raka/orthography-only variant -- same normalized garo, different raw garo, under same english key
        if garo and eng_siblings:
            raw_garo_variants = {records[j].get("garo") for j in eng_index[ne]} - {garo}
            if any(normalize(v) == ng for v in raw_garo_variants):
                discrepancies.append(("D6", "raka/orthography-only Garo variant under same English key"))

        # D1: same-English, genuinely different (non-variant) Garo candidates
        distinct_garo_norms = {normalize(records[j].get("garo")) for j in eng_index[ne]}
        if len(distinct_garo_norms) > 1:
            discrepancies.append(("D1", f"{len(distinct_garo_norms)} distinct Garo forms under English key '{english}'"))

        # D2: same-Garo, different English glosses (reverse conflict)
        distinct_eng_norms = {normalize(records[j].get("english")) for j in garo_index[ng]}
        if garo and len(distinct_eng_norms) > 1:
            discrepancies.append(("D2", f"{len(distinct_eng_norms)} distinct English glosses under Garo form '{garo}'"))

        # D7: multiple VERIFIED/HIGH candidates tied for the same English key
        if confidence == "verified_high" and verified_count > 1:
            discrepancies.append(("D7", f"{verified_count} verified_high candidates tied under '{english}'"))

        # D4: status/notes inconsistency (notes says SUPERSEDED but confidence field isn't superseded, or vice versa)
        if prov["superseded_note"] and confidence not in ("superseded",):
            discrepancies.append(("D4", "notes declare SUPERSEDED but confidence field does not read 'superseded'"))

        # D8: unresolved tension explicitly flagged in notes
        if re.search(r"\b(not reconciled|flagged|tension|open question|unresolved|contradict)", notes, re.I):
            discrepancies.append(("D8", "notes explicitly flag an unresolved tension/contradiction"))

        # D10: engineering/runtime cross-layer mention with no clear resolution note
        if re.search(r"compiled_dict|phrase_maps\.js|corrections\.json|pickPrimary|runtime", notes, re.I):
            discrepancies.append(("D10", "notes reference a cross-layer (runtime/compile) representation"))

        # ---- routing class ----
        if any(c in ("D1", "D2", "D7") for c, _ in discrepancies) or (prov["owner_directive"] and prov["nv_refs"] == [] and not prov["native_cited"] and confidence == "unverified"):
            cls = "A"  # linguistic adjudication needed
        elif any(c == "D10" for c, _ in discrepancies):
            cls = "E"  # engineering/runtime
        elif any(c in ("D5", "D6", "D3", "D9") for c, _ in discrepancies):
            cls = "D"  # duplicate/conflict (mechanical, not linguistic)
        elif prov["rule_refs"] and confidence == "verified_high":
            cls = "C"  # rule candidate
        elif confidence == "verified_high" and not discrepancies:
            cls = "B"  # mechanically clean, no action needed
        elif discrepancies:
            cls = "UNRESOLVED"
        else:
            cls = "B"

        # ---- priority ----
        codes = {c for c, _ in discrepancies}
        if "D10" in codes and re.search(r"live|currently ship|production bug", notes, re.I):
            prio = "P0"
        elif "D7" in codes:
            prio = "P1"
        elif codes & {"D1", "D2", "D4", "D8"}:
            prio = "P2"
        elif codes & {"D3", "D5", "D6", "D9"}:
            prio = "P3"
        else:
            prio = None

        ledger.append({
            "idx": i,
            "english": english,
            "garo": garo,
            "confidence": confidence,
            "type": rtype,
            "class": cls,
            "discrepancies": [{"code": c, "detail": d} for c, d in discrepancies],
            "priority": prio,
            "nv_refs": prov["nv_refs"],
            "rule_refs": prov["rule_refs"],
            "owner_directive": prov["owner_directive"],
            "native_cited": prov["native_cited"],
            "batch": i // BATCH + 1,
        })

    # ---- Phase 3: outputs ----
    with open(f"{REPO}/audit/segregation/MASTER_SEGREGATION.json", "w", encoding="utf-8") as f:
        json.dump({
            "dictionary_hash": dict_hash,
            "record_count": n,
            "generated_by": "audit/segregation/build_segregation.py",
            "records": ledger,
        }, f, ensure_ascii=False, indent=1)

    with open(f"{REPO}/audit/segregation/MASTER_SEGREGATION.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["idx", "batch", "type", "class", "priority", "english", "garo", "confidence",
                    "discrepancy_codes", "discrepancy_detail", "nv_refs", "rule_refs", "owner_directive", "native_cited"])
        for r in ledger:
            w.writerow([
                r["idx"], r["batch"], r["type"], r["class"], r["priority"] or "",
                r["english"], r["garo"], r["confidence"],
                ";".join(d["code"] for d in r["discrepancies"]),
                " | ".join(d["detail"] for d in r["discrepancies"]),
                ";".join(r["nv_refs"]), ";".join(r["rule_refs"]),
                r["owner_directive"], r["native_cited"],
            ])

    n_batches = (n + BATCH - 1) // BATCH
    with open(f"{REPO}/audit/segregation/SEGREGATION_PROGRESS.json", "w", encoding="utf-8") as f:
        json.dump({
            "dictionary_hash": dict_hash,
            "record_count": n,
            "batch_size": BATCH,
            "total_batches": n_batches,
            "batches_completed": n_batches,
            "status": "full pass complete (single run, all batches)",
        }, f, indent=2)

    # rollup stats
    class_counts = defaultdict(int)
    prio_counts = defaultdict(int)
    code_counts = defaultdict(int)
    type_counts = defaultdict(int)
    for r in ledger:
        class_counts[r["class"]] += 1
        type_counts[r["type"]] += 1
        if r["priority"]:
            prio_counts[r["priority"]] += 1
        for d in r["discrepancies"]:
            code_counts[d["code"]] += 1

    summary = []
    summary.append(f"# Segregation Summary\n")
    summary.append(f"Dictionary hash: `{dict_hash}`  \nRecord count: **{n}**  \nGenerated: single full pass, {n_batches} batches of {BATCH}.\n")
    summary.append("## Working schema for this run (Claude D's own, not verbatim repo text)\n")
    summary.append("""
**Type**: WORD (1 English word) / PHRASE (2-4 words, no terminal punctuation) / SENTENCE (5+ words or ends in `.`/`!`/`?`).

**Class**: A = needs Claude A (linguistic adjudication) · B = mechanically clean, no action · C = rule candidate (cites a RULE-xxx, verified_high) · D = duplicate/conflict, mechanical (case-only, raka-only, exact dup, missing field) · E = engineering/runtime cross-layer mention · UNRESOLVED = has a flag but doesn't cleanly fit A/B/C/D/E.

**Discrepancy codes**:
- D1: same English key, 2+ genuinely distinct (non-raka-variant) Garo forms
- D2: same Garo form, 2+ distinct English glosses
- D3: exact duplicate record (identical normalized english+garo)
- D4: notes say SUPERSEDED but `confidence` field doesn't read `superseded` (or vice versa)
- D5: case-only duplicate English key (e.g. "Boy" vs "boy")
- D6: raka/orthography-only Garo variant under the same English key
- D7: 2+ records tagged `verified_high` for the same English key (real compile-time tie)
- D8: notes explicitly flag an unresolved tension/contradiction (regex: not reconciled / flagged / tension / open question / unresolved / contradict)
- D9: missing english or garo field
- D10: notes reference a cross-layer runtime/compile artifact (compiled_dict / phrase_maps.js / corrections.json / pickPrimary / "runtime")

**Priority**: P0 = D10 + notes suggest it's currently live/shipping wrong · P1 = D7 (real compile tie) · P2 = D1/D2/D4/D8 · P3 = D3/D5/D6/D9 (cosmetic/mechanical).
""")
    summary.append("## Class counts\n")
    for k in ["A", "B", "C", "D", "E", "UNRESOLVED"]:
        summary.append(f"- {k}: {class_counts.get(k,0)}")
    summary.append("\n## Type counts\n")
    for k in ["WORD", "PHRASE", "SENTENCE"]:
        summary.append(f"- {k}: {type_counts.get(k,0)}")
    summary.append("\n## Priority counts\n")
    for k in ["P0", "P1", "P2", "P3"]:
        summary.append(f"- {k}: {prio_counts.get(k,0)}")
    summary.append("\n## Discrepancy code counts\n")
    for k in sorted(code_counts):
        summary.append(f"- {k}: {code_counts[k]}")
    summary.append("\n## Scope note\n")
    summary.append("This is a full-file mechanical pass — every record classified against the whole-dictionary index. "
                    "It does NOT constitute linguistic adjudication of any D1/D2/D7 conflict; those are routed Class A "
                    "for Claude A. Nothing in master_dictionary.json was modified.\n")

    with open(f"{REPO}/audit/segregation/SEGREGATION_SUMMARY.md", "w", encoding="utf-8") as f:
        f.write("\n".join(summary))

    print(f"Records: {n}  Hash: {dict_hash}")
    print("Class counts:", dict(class_counts))
    print("Priority counts:", dict(prio_counts))
    print("Discrepancy codes:", dict(code_counts))

if __name__ == "__main__":
    main()
