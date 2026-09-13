#!/usr/bin/env python3
"""
Claude D — full forensic analysis against ACTUAL current main HEAD.
Observe/classify/flag only. No writes to master_dictionary.json or any
canonical/runtime/rule file anywhere in this script.
"""
import json, re, subprocess, unicodedata
from collections import defaultdict, Counter

REPO = "/home/claude/repo"

def sh(*args):
    return subprocess.check_output(list(args), cwd=REPO).decode().strip()

HEAD = sh("git", "rev-parse", "HEAD")
BRANCH = sh("git", "rev-parse", "--abbrev-ref", "HEAD")
DICT_HASH = sh("git", "hash-object", "master_dictionary.json")

with open(f"{REPO}/master_dictionary.json", encoding="utf-8") as f:
    records = json.load(f)
N = len(records)

with open(f"{REPO}/data/garo_number_system_machine_ready.json", encoding="utf-8") as f:
    numsys = json.load(f)
with open(f"{REPO}/data/garo_number_classifier_engine_machine_ready.json", encoding="utf-8") as f:
    classeng = json.load(f)

base_numbers = numsys["base_numbers"]  # {"1":"Sa", ...}
number_words = set(v.lower() for v in base_numbers.values())
classifier_units = sorted({row.get("classifier_or_unit") for row in classeng["classifier_table"] if row.get("classifier_or_unit")})

# ---------------- Section 1: repo state ----------------
eng_raw = [(r.get("english") or "").strip() for r in records]
garo_raw = [(r.get("garo") or "").strip() for r in records]
eng_ctr = Counter(eng_raw)
garo_ctr = Counter(garo_raw)
pair_ctr = Counter(zip(eng_raw, garo_raw))

section1 = {
    "head_commit": HEAD,
    "branch": BRANCH,
    "master_dictionary_hash": DICT_HASH,
    "record_count": N,
    "unique_english_keys_raw": len(eng_ctr),
    "unique_garo_values_raw": len(garo_ctr),
    "duplicate_english_keys_raw": sum(1 for v in eng_ctr.values() if v > 1),
    "duplicate_english_keys_records_involved": sum(v for v in eng_ctr.values() if v > 1),
    "duplicate_english_garo_pairs_raw": sum(1 for v in pair_ctr.values() if v > 1),
    "duplicate_english_garo_pairs_records_involved": sum(v for v in pair_ctr.values() if v > 1),
}

# ---------------- helpers ----------------
def strip_raka(s):
    return (s or "").replace("\u00b7", "").replace(".", "")

def norm(s):
    s = strip_raka(s or "")
    return re.sub(r"\s+", " ", s).strip().lower()

number_word_pattern = "|".join(sorted((re.escape(w) for w in number_words), key=len, reverse=True))
NUMWORD_RE = re.compile(rf"\b({number_word_pattern})\b", re.I)
DIGIT_RE = re.compile(r"\b\d+\b")

classifier_pattern = "|".join(re.escape(c) for c in classifier_units)
CLASSIFIER_RE = re.compile(rf"({classifier_pattern})", re.I)

IRREGULAR_NOUNS = {"fish", "sheep", "deer", "moose", "series", "species", "aircraft",
                    "salmon", "trout", "cod", "people", "children", "men", "women", "mice", "oxen"}

MALFORMED_PLURAL_RE = re.compile(
    r"\b(" + "|".join(IRREGULAR_NOUNS) + r")s\b", re.I
)

def has_number_word(e):
    return bool(NUMWORD_RE.search(e or "")) or bool(DIGIT_RE.search(e or ""))

def garo_matches_classifier_pattern(g):
    return bool(CLASSIFIER_RE.search(g or ""))

# ---------------- Section 3: generated counting detection ----------------
generated_hits = []
for i, r in enumerate(records):
    e, g = r.get("english") or "", r.get("garo") or ""
    eng_has_num = has_number_word(e)
    garo_has_classifier = garo_matches_classifier_pattern(g)
    garo_has_numword = bool(re.search(rf"({number_word_pattern})", g, re.I))
    if eng_has_num and (garo_has_classifier or garo_has_numword):
        verdict = "GENERATED_INSTANCE" if (garo_has_classifier and garo_has_numword) else "UNCERTAIN"
        generated_hits.append({"idx": i, "english": e, "garo": g, "verdict": verdict})

gen_counts = Counter(h["verdict"] for h in generated_hits)

# ---------------- Section 4: malformed English keys ----------------
malformed = []
for i, r in enumerate(records):
    e = r.get("english") or ""
    m = MALFORMED_PLURAL_RE.search(e)
    if m:
        malformed.append({"idx": i, "english": e, "garo": r.get("garo"), "matched_noun": m.group(1)})

malformed_by_noun = Counter(m["matched_noun"].lower() for m in malformed)
malformed_with_garo = sum(1 for m in malformed if (m["garo"] or "").strip())

# ---------------- Section 5: duplicate vs shared-Garo ----------------
true_dup_pairs = {k: v for k, v in pair_ctr.items() if v > 1}
eng_to_garoset = defaultdict(set)
garo_to_engset = defaultdict(set)
for e, g in zip(eng_raw, garo_raw):
    eng_to_garoset[norm(e)].add(norm(g))
    garo_to_engset[norm(g)].add(norm(e))

shared_garo_keys = {g: es for g, es in garo_to_engset.items() if len(es) > 1 and g}
same_eng_diff_garo_keys = {e: gs for e, gs in eng_to_garoset.items() if len(gs) > 1 and e}

# ---------------- Section 6: confidence/status forensics ----------------
conf_ctr = Counter((r.get("confidence") or "MISSING").lower() for r in records)
contradictions = []
for i, r in enumerate(records):
    conf = (r.get("confidence") or "").lower()
    notes = r.get("notes") or ""
    if "superseded" in notes.lower() and conf not in ("superseded",):
        contradictions.append({"idx": i, "type": "notes=SUPERSEDED but confidence!=superseded", "confidence": conf, "english": r.get("english")})
    if conf in ("verified_high",) and re.search(r"\bocr\b|\bweak\b|\bunverified\b", notes, re.I):
        contradictions.append({"idx": i, "type": "confidence=verified_high but notes mention weak/OCR/unverified", "confidence": conf, "english": r.get("english")})

# identical eng/garo pairs under different confidence states
pair_conf = defaultdict(set)
for r in records:
    key = (norm(r.get("english")), norm(r.get("garo")))
    pair_conf[key].add((r.get("confidence") or "MISSING").lower())
pairs_multi_confidence = {k: v for k, v in pair_conf.items() if len(v) > 1}

# ---------------- Section 7: provenance forensics ----------------
NOTES_MISSING = sum(1 for r in records if not (r.get("notes") or "").strip())
OCR_PROV = sum(1 for r in records if re.search(r"\bocr\b", (r.get("notes") or ""), re.I))
NATIVE_PROV = sum(1 for r in records if re.search(r"thangseng|native[- ]confirm|native[- ]validat", (r.get("notes") or ""), re.I))
OWNER_PROV = sum(1 for r in records if re.search(r"project owner", (r.get("notes") or ""), re.I))
SUPERSESSION_NOTE = sum(1 for r in records if "superseded" in (r.get("notes") or "").lower())
notes_ctr = Counter((r.get("notes") or "").strip() for r in records if (r.get("notes") or "").strip())
repeated_notes = {k: v for k, v in notes_ctr.items() if v > 3}  # suspiciously repeated verbatim notes

# ---------------- Section 8: English key normalization audit ----------------
case_variant_groups = defaultdict(set)
for e in eng_raw:
    case_variant_groups[e.lower()].add(e)
case_variants = {k: v for k, v in case_variant_groups.items() if len(v) > 1}

punct_variant_groups = defaultdict(set)
for e in eng_raw:
    stripped = re.sub(r"[?.!,]", "", e).strip()
    punct_variant_groups[stripped.lower()].add(e)
punct_variants = {k: v for k, v in punct_variant_groups.items() if len(v) > 1}

ws_variant_groups = defaultdict(set)
for e in eng_raw:
    collapsed = re.sub(r"\s+", " ", e).strip()
    if collapsed != e:
        ws_variant_groups[collapsed].add(e)
whitespace_variants = {k: v for k, v in ws_variant_groups.items() if v}

digit_vs_word = []
for r in records:
    e = r.get("english") or ""
    if DIGIT_RE.search(e):
        digit_form = e
        word_form_guess = NUMWORD_RE.sub(lambda m: m.group(0), e)  # just flag presence
        digit_vs_word.append(e)

# naive singular/plural variant detection: key and key+'s' both present
plural_variants = []
engset_lower = set(e.lower() for e in eng_raw)
for e in set(eng_raw):
    el = e.lower()
    if el.endswith("s") and el[:-1] in engset_lower:
        plural_variants.append((el[:-1], el))

# ---------------- Section 9: Garo orthography forensics ----------------
interpunct_vs_period = []
for r in records:
    g = r.get("garo") or ""
    if "\u00b7" in g and "." in g:
        interpunct_vs_period.append({"english": r.get("english"), "garo": g})

space_variant_groups = defaultdict(set)
for g in garo_raw:
    collapsed = g.replace(" ", "")
    space_variant_groups[collapsed.lower()].add(g)
space_variants = {k: v for k, v in space_variant_groups.items() if len(v) > 1}

garo_case_groups = defaultdict(set)
for g in garo_raw:
    garo_case_groups[g.lower()].add(g)
garo_case_variants = {k: v for k, v in garo_case_groups.items() if len(v) > 1}

repeated_punct = [g for g in set(garo_raw) if re.search(r"([.\u00b7,])\1", g)]

# unicode NFC/NFD or lookalike detection: compare normalized forms
unicode_mismatch = []
seen_ascii = defaultdict(set)
for g in set(garo_raw):
    nfc = unicodedata.normalize("NFC", g)
    nfd = unicodedata.normalize("NFD", g)
    if nfc != g or nfd == g and nfc != nfd:
        unicode_mismatch.append(g)
# visually similar unicode chars (e.g. middle dot variants)
lookalike_dots = {"\u00b7", "\u2022", "\u2219", "\u02d9", "\uff0e"}
lookalike_hits = [g for g in set(garo_raw) if any(ch in g for ch in lookalike_dots - {"\u00b7"})]

trailing_ws = [g for g in set(garo_raw) if g != g.strip()]

# ---------------- Section 10: number/classifier contamination by domain ----------------
DOMAIN_KEYWORDS = {
    "human_counting": ["student", "teacher", "man", "woman", "boy", "girl", "child", "person", "people"],
    "animal": ["dog", "cat", "cow", "tiger", "lion", "horse", "bird", "fish"],
    "fruit": ["banana", "orange", "mango", "pineapple", "apple", "fruit"],
    "water_liquid": ["water", "glass", "milk"],
    "measurement": ["kg", "litre", "kilogram", "meter", "metre"],
    "geography": ["road", "village", "mountain", "hill", "river"],
    "vehicle": ["car", "bus", "bicycle", "truck"],
}
domain_class = defaultdict(lambda: Counter())
for i, r in enumerate(records):
    e = (r.get("english") or "").lower()
    g = r.get("garo") or ""
    for domain, kws in DOMAIN_KEYWORDS.items():
        if any(kw in e for kw in kws):
            eng_has_num = has_number_word(e)
            garo_has_classifier = garo_matches_classifier_pattern(g)
            if eng_has_num and garo_has_classifier:
                domain_class[domain]["GENERATED_LIKELY"] += 1
            elif eng_has_num or garo_has_classifier:
                domain_class[domain]["UNCERTAIN"] += 1
            else:
                domain_class[domain]["LEXICAL_LIKELY"] += 1

# ---------------- Section 11: compare against machine-ready contracts ----------------
numsys_records = {(r["english"].lower(), r["garo"]) for r in numsys["records"]}
master_pairs_lower = {(e.lower(), g) for e, g in zip(eng_raw, garo_raw)}
numsys_overlap = numsys_records & master_pairs_lower

worked_examples = classeng.get("worked_examples", [])
worked_surfaces = set()
for w in worked_examples:
    s = w.get("approved_surface") or w.get("surface")
    if s:
        worked_surfaces.add(norm(s))
master_surfaces_norm = {norm(g) for g in garo_raw}
worked_overlap = worked_surfaces & master_surfaces_norm

# noun-level overlap: does master_dictionary contain generated instances for classifier_table nouns?
classifier_nouns = set()
for row in classeng["classifier_table"]:
    gn = row.get("garo_noun")
    if gn:
        classifier_nouns.add(gn.lower())
noun_generated_hits = 0
for i, r in enumerate(records):
    g = (r.get("garo") or "").lower()
    e = r.get("english") or ""
    if any(gn in g for gn in classifier_nouns) and has_number_word(e):
        noun_generated_hits += 1

# ---------------- Section 12: full classification ----------------
generated_idx = {h["idx"] for h in generated_hits}
malformed_idx = {m["idx"] for m in malformed}

class_counts = Counter()
for i, r in enumerate(records):
    e, g = r.get("english") or "", r.get("garo") or ""
    conf = (r.get("confidence") or "").lower()
    notes = r.get("notes") or ""
    rtype_words = len(e.split())
    if i in malformed_idx:
        class_counts["MALFORMED_KEYS"] += 1
    elif i in generated_idx:
        class_counts["GENERATED_INSTANCES"] += 1
    elif "superseded" in notes.lower() or conf == "superseded":
        class_counts["POSSIBLE_STALE"] += 1
    elif norm(e) in same_eng_diff_garo_keys or norm(g) in shared_garo_keys:
        class_counts["LINGUISTIC_REVIEW_REQUIRED"] += 1
    elif (e, g) in true_dup_pairs:
        class_counts["DUPLICATES"] += 1
    elif rtype_words >= 5 or e.strip().endswith(("?", "!", ".")):
        class_counts["SENTENCES"] += 1
    elif rtype_words >= 2:
        class_counts["PHRASES"] += 1
    else:
        class_counts["LEXICAL_CANDIDATES"] += 1

orthography_variant_records = len(space_variants) + len(garo_case_variants) + len(repeated_punct) + len(interpunct_vs_period)
provenance_anomaly_records = len(contradictions) + len(pairs_multi_confidence)

section12 = {
    "TOTAL_RECORDS": N,
    **class_counts,
    "PROVENANCE_ANOMALIES": provenance_anomaly_records,
    "ORTHOGRAPHY_VARIANTS_GROUPS": orthography_variant_records,
    "UNRESOLVED": N - sum(class_counts.values()),
}

# ---------------- dump everything ----------------
out = {
    "section1_repo_state": section1,
    "section3_generated_counting": {
        "total_hits": len(generated_hits),
        "by_verdict": dict(gen_counts),
        "examples": generated_hits[:15],
    },
    "section4_malformed_keys": {
        "total": len(malformed),
        "with_garo_counterpart": malformed_with_garo,
        "by_noun": dict(malformed_by_noun),
        "examples": malformed[:20],
    },
    "section5_duplicate_vs_shared": {
        "true_duplicate_pairs": len(true_dup_pairs),
        "true_duplicate_records_involved": sum(true_dup_pairs.values()),
        "shared_garo_keys_count": len(shared_garo_keys),
        "shared_garo_records_involved_english_senses": sum(len(v) for v in shared_garo_keys.values()),
        "same_english_diff_garo_keys_count": len(same_eng_diff_garo_keys),
    },
    "section6_confidence_forensics": {
        "by_confidence": dict(conf_ctr),
        "contradictions_count": len(contradictions),
        "contradictions_examples": contradictions[:15],
        "pairs_with_multiple_confidence_states": len(pairs_multi_confidence),
    },
    "section7_provenance_forensics": {
        "notes_missing": NOTES_MISSING,
        "ocr_provenance_mentions": OCR_PROV,
        "native_speaker_provenance_mentions": NATIVE_PROV,
        "owner_directive_provenance_mentions": OWNER_PROV,
        "supersession_notes": SUPERSESSION_NOTE,
        "suspiciously_repeated_verbatim_notes_groups": len(repeated_notes),
        "repeated_notes_examples": {k[:120]: v for k, v in list(repeated_notes.items())[:5]},
    },
    "section8_english_key_normalization": {
        "case_variant_groups": len(case_variants),
        "case_variant_examples": {k: list(v) for k, v in list(case_variants.items())[:10]},
        "punctuation_variant_groups": len(punct_variants),
        "whitespace_variant_groups": len(whitespace_variants),
        "digit_vs_written_number_count": len(digit_vs_word),
        "digit_vs_written_number_examples": digit_vs_word[:10],
        "naive_singular_plural_pairs": len(plural_variants),
        "singular_plural_examples": plural_variants[:10],
    },
    "section9_garo_orthography": {
        "interpunct_and_period_in_same_string": len(interpunct_vs_period),
        "interpunct_period_examples": interpunct_vs_period[:10],
        "space_variant_groups": len(space_variants),
        "space_variant_examples": {k: list(v) for k, v in list(space_variants.items())[:10]},
        "garo_case_variant_groups": len(garo_case_variants),
        "repeated_punctuation_count": len(repeated_punct),
        "repeated_punctuation_examples": repeated_punct[:10],
        "unicode_lookalike_dot_hits": len(lookalike_hits),
        "unicode_lookalike_examples": lookalike_hits[:10],
        "trailing_leading_whitespace_count": len(trailing_ws),
    },
    "section10_domain_contamination": {k: dict(v) for k, v in domain_class.items()},
    "section11_machine_ready_contract_comparison": {
        "numsys_base_number_records": len(numsys["records"]),
        "numsys_records_found_verbatim_in_master": len(numsys_overlap),
        "classifier_engine_worked_examples": len(worked_examples),
        "worked_example_surfaces_found_in_master": len(worked_overlap),
        "records_containing_a_classifier_table_noun_plus_a_number_word": noun_generated_hits,
    },
    "section12_full_classification": section12,
}

with open(f"{REPO}/audit/segregation/FULL_FORENSIC_ANALYSIS.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1, default=str)

print(json.dumps({k: (v if k in ("section1_repo_state",) else "...") for k, v in out.items()}, indent=1))
print("WRITTEN.")
