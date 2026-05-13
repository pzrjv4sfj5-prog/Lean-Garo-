import json
import os

def merge_garo_dictionaries():
    """
    Merge garo_dictionary(2).json into garo_dictionary.json with deduplication
    and specific corrections.
    """
    try:
        # Define correction mappings
        corrections = {
            "tasty": "Toa",
            "not tasty": "Touja",
            "wait": "Damo/Sengbo",
            "salt": "Kari",
            "dongja": "No more",
            "donga": "It exists",
            "quick": "Tarkbo",
            "i don't care": "Anga Dal·e Ra·ja"
        }

        # Load main dictionary (should be an array)
        with open('garo_dictionary.json', 'r', encoding='utf-8') as f:
            main_data = json.load(f)
            if not isinstance(main_data, list):
                main_data = []

        # Load secondary dictionary (object structure)
        with open('garo_dictionary (2).json', 'r', encoding='utf-8') as f:
            new_dict = json.load(f)

        # Extract entries from the object structure
        new_entries = []
        def extract_entries(obj, path=''):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    if key.startswith('_'):
                        continue
                    if isinstance(value, str):
                        # Direct key-value pair
                        new_entries.append({"english": key, "garo": value})
                    elif isinstance(value, dict):
                        extract_entries(value, f"{path}.{key}" if path else key)
                    elif isinstance(value, list):
                        for item in value:
                            if isinstance(item, dict) and 'english' in item and 'garo' in item:
                                new_entries.append(item)

        extract_entries(new_dict)

        print(f"Extracted {len(new_entries)} entries from garo_dictionary (2).json")
        
        # Debug: check first few entries
        print("Sample extracted entries:")
        for i, entry in enumerate(new_entries[:5]):
            print(f"  {i+1}: {entry}")

        # Create lookup map from main dictionary (but don't deduplicate)
        main_entries = []
        for item in main_data:
            if 'english' in item and 'garo' in item:
                main_entries.append(item)

        # Process new entries (keep all, don't deduplicate)
        merged_count = 0

        for item in new_entries:
            if 'english' not in item or 'garo' not in item:
                continue

            eng = item['english'].strip()
            garo = item['garo'].strip()

            # Apply specific corrections
            key = eng.lower().strip()
            if key in corrections:
                garo = corrections[key]

            # Add all entries (no deduplication)
            main_entries.append({"english": eng, "garo": garo})
            merged_count += 1

        # Save merged dictionary
        with open('garo_dictionary.json', 'w', encoding='utf-8') as f:
            json.dump(main_entries, f, indent=2, ensure_ascii=False)

        print(f"Merge complete!")
        print(f"New entries added: {merged_count}")
        print(f"Total entries: {len(main_entries)}")

    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON - {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    merge_garo_dictionaries()