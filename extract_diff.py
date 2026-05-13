import json

try:
    with open('garo_dictionary.json', 'r', encoding='utf-8') as f:
        main_data = json.load(f)
    with open('garo_dictionary(2).json', 'r', encoding='utf-8') as f:
        new_data = json.load(f)

    # Convert the main list to a set of stringified items for fast comparison
    # This catches any change in spelling, definition, or example sentences
    main_set = {json.dumps(item, sort_keys=True, ensure_ascii=False) for item in main_data}

    diff_list = []
    for item in new_data:
        item_str = json.dumps(item, sort_keys=True, ensure_ascii=False)
        if item_str not in main_set:
            diff_list.append(item)

    with open('to_validate.json', 'w', encoding='utf-8') as f:
        json.dump(diff_list, f, indent=2, ensure_ascii=False)

    print(f"Success: Extracted {len(diff_list)} items to to_validate.json")
except Exception as e:
    print(f"Error: {e}")
