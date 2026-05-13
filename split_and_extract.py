import json
import os

try:
    # 1. Load both JSON databases
    with open('garo_dictionary.json', 'r', encoding='utf-8') as f:
        main_data = json.load(f)
    with open('garo_dictionary(2).json', 'r', encoding='utf-8') as f:
        new_data = json.load(f)

    # 2. Map existing entries by their English terms for fast indexing
    main_lookup = {item['english'].lower().strip(): item['garo'].strip() for item in main_data if 'english' in item and 'garo' in item}

    # 3. Filter entries that are completely new or have differing Garo translations
    to_verify = []
    for item in new_data:
        if 'english' not in item or 'garo' not in item:
            continue
        eng = item['english'].strip()
        garo = item['garo'].strip()
        
        if eng.lower().strip() not in main_lookup or main_lookup[eng.lower().strip()] != garo:
            to_verify.append({"english": eng, "garo": garo})

    print(f"Total items requiring verification: {len(to_verify)}")

    # 4. Split entries into 200-word sub-files to manage the 1% quota safely
    chunk_size = 200
    os.makedirs('chunks', exist_ok=True)
    
    for i in range(0, len(to_verify), chunk_size):
        chunk = to_verify[i:i + chunk_size]
        chunk_num = (i // chunk_size) + 1
        with open(f'chunks/batch_{chunk_num}.json', 'w', encoding='utf-8') as cf:
            json.dump(chunk, cf, indent=2, ensure_ascii=False)
        print(f"Created: chunks/batch_{chunk_num}.json ({len(chunk)} words)")

    print("\nExtraction complete! Check the 'chunks' folder.")
except Exception as e:
    print(f"Error executing script: {e}")
