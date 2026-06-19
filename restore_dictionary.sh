#!/bin/bash
set -e
if [ ! -f backups/garo_dictionary_before_cleanup.json ] || [ ! -f backups/master_dictionary_before_cleanup.json ]; then
  echo "ERROR: backup files not found in backups/. Aborting."
  exit 1
fi
cp backups/garo_dictionary_before_cleanup.json garo_dictionary.json
cp backups/master_dictionary_before_cleanup.json master_dictionary.json
echo "Restored. Remember to run: npm run build"
