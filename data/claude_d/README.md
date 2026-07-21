# data/claude_d/

Owned exclusively by Claude D. No other role commits here except
Claude D; Claude D commits nowhere else in the repository.

Full spec: `.ai/SESSION_BOOTSTRAP.md`, section "Claude A directive to
Claude D — output schema and scope (2026-07-21)".

- `processed/<page>.flat.json` — pages Claude D recognized as the
  canonical `garo_to_english` schema and successfully ran through
  `scripts/flip-garo-to-english.js` + `scripts/reduce-to-flat.js`.
  Ready for `scripts/import-dictionary.js` as-is.
- `incoming_unrecognized/<page>.raw.json` — pages in some other
  schema. Pushed untouched. Claude A decides the conversion, if any.
- `manifest.json` — one entry per page: `page`, `status`
  (`processed` | `schema_not_recognized`), `output_path`.

Claude D performs no linguistic judgment, no schema-guessing beyond
the one recognized canonical shape, and makes no other repository
changes.
