#!/usr/bin/env python3
import json

TARGETS = [
    (1252, "eight dogs", "chet mang·gni", "superseded"),
    (1253, "eight birds", "chet mang·gni", "superseded"),
    (1254, "eight fishs", "chet mang·gni", "superseded"),
    (1456, "eight dog", "chet mang·gni", "superseded"),
    (1457, "eight cat", "chet mang·gni", "superseded"),
    (1458, "eight bird", "chet mang·gni", "superseded"),
    (1459, "eight fish", "chet mang·gni", "superseded"),
    (1523, "eleven dog", "chi sa mang·gni", "superseded"),
    (1524, "eleven cat", "chi sa mang·gni", "superseded"),
    (1525, "eleven bird", "chi sa mang·gni", "superseded"),
    (1526, "eleven fish", "chi sa mang·gni", "superseded"),
    (1466, "eight apple", "chet se·gni", "superseded"),
]

with open("master_dictionary.json", encoding="utf-8") as f:
    records = json.load(f)

orig_len = len(records)

# Verify every target matches exactly before touching anything
for idx, eng, garo, conf in TARGETS:
    r = records[idx]
    assert r.get("english") == eng, f"MISMATCH idx={idx} english: {r.get('english')!r} != {eng!r}"
    assert r.get("garo") == garo, f"MISMATCH idx={idx} garo: {r.get('garo')!r} != {garo!r}"
    assert r.get("confidence") == conf, f"MISMATCH idx={idx} confidence: {r.get('confidence')!r} != {conf!r}"

target_idxs = sorted({t[0] for t in TARGETS}, reverse=True)
assert len(target_idxs) == 12, f"expected 12 unique idx, got {len(target_idxs)}"

removed = []
for idx in target_idxs:
    removed.append(records[idx])
    del records[idx]

assert len(records) == orig_len - 12
assert len(removed) == 12

with open("master_dictionary.json", "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"Removed {len(removed)} records. New total: {len(records)} (was {orig_len}).")
for r in removed:
    print(" -", r["english"], "|", r["garo"], "|", r["confidence"])
