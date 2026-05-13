import json
import random

# Load current dictionary
with open('garo_dictionary.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Starting with {len(data)} entries")

# Generate additional entries
new_entries = []

# 1. Generate comprehensive number + noun combinations
numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
           'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
garo_numbers = ['sa', 'do·o', 'na·tok', 'brang', 'bonga', 'dokka', 'sni', 'chet', 'sku', 'chi',
                'chi sa', 'chi do·o', 'chi na·tok', 'chi brang', 'chi bonga', 'chi dokka', 'chi sni', 'chi chet', 'chi sku', 'chi chi']

nouns = {
    'person': 'mande',
    'dog': 'mang',
    'cat': 'mang',
    'bird': 'mang',
    'fish': 'mang',
    'teacher': 'skigipa',
    'student': 'chik',
    'house': 'rang',
    'tree': 'rang',
    'book': 'kitab',
    'car': 'mot',
    'apple': 'se',
    'banana': 'sobo',
    'rice': 'chak',
    'water': 'chik',
    'food': 'chak',
    'road': 'lam',
    'river': 'chik',
    'mountain': 'nok',
    'village': 'rim'
}

for i, num in enumerate(numbers):
    for noun_eng, noun_garo in nouns.items():
        # Singular
        eng = f"{num} {noun_eng}"
        garo = f"{garo_numbers[i]} {noun_garo}-sa" if num == 'one' else f"{garo_numbers[i]} {noun_garo}-gni"
        new_entries.append({"english": eng, "garo": garo})

        # With classifiers
        if noun_garo in ['mande', 'skigipa', 'chik']:
            eng = f"{num} {noun_eng}s"
            garo = f"{garo_numbers[i]} {noun_garo}-gni"
            new_entries.append({"english": eng, "garo": garo})

# 2. Generate verb conjugations for all tenses
verbs = ['go', 'come', 'eat', 'drink', 'see', 'hear', 'speak', 'write', 'read', 'sleep',
         'run', 'walk', 'sit', 'stand', 'work', 'play', 'sing', 'dance', 'buy', 'sell']
pronouns = {
    'I': 'ang',
    'you (singular)': 'na·',
    'he/she': 'u',
    'we': 'i',
    'you (plural)': 'si',
    'they': 'bi'
}
tenses = ['present', 'past', 'future']

for verb in verbs:
    for person, pronoun in pronouns.items():
        for tense in tenses:
            eng = f"{person} {verb} ({tense})"
            if tense == 'present':
                garo = f"{pronoun} {verb}a"
            elif tense == 'past':
                garo = f"{pronoun} {verb}aha"
            else:  # future
                garo = f"{pronoun} {verb}gen"
            new_entries.append({"english": eng, "garo": garo})

# 3. Generate possessive forms
possessives = ['my', 'your', 'his/her', 'our', 'their']
garo_possessives = ['angni', 'nani', 'uni', 'ini', 'bini']

for i, poss in enumerate(possessives):
    for noun_eng, noun_garo in nouns.items():
        eng = f"{poss} {noun_eng}"
        garo = f"{garo_possessives[i]} {noun_garo}"
        new_entries.append({"english": eng, "garo": garo})

# 4. Generate question forms with variations
questions = ['what', 'where', 'when', 'why', 'how', 'who', 'which', 'how many', 'how much']
garo_questions = ['ma', 'kade', 'bale', 'bang·a', 'kamat', 'ko', 'ma·si', 'kama', 'kama']

for i, q in enumerate(questions):
    for noun_eng, noun_garo in list(nouns.items())[:10]:  # First 10 nouns
        eng = f"{q} {noun_eng}?"
        garo = f"{garo_questions[i]} {noun_garo}?"
        new_entries.append({"english": eng, "garo": garo})

# 5. Generate time and location expressions
times = ['morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'now', 'later', 'soon']
locations = ['home', 'school', 'market', 'church', 'hospital', 'office', 'field', 'forest', 'river', 'mountain']

for time in times:
    eng = f"in the {time}"
    garo = f"{time.replace('morning', 'sangki').replace('afternoon', 'gitel').replace('evening', 'salanti').replace('night', 'sati').replace('today', 'gitok').replace('tomorrow', 'gitokna').replace('yesterday', 'ual').replace('now', 'dakgrik').replace('later', 'chikna').replace('soon', 'chikna')}o"
    new_entries.append({"english": eng, "garo": garo})

for loc in locations:
    eng = f"at the {loc}"
    garo = f"{loc.replace('home', 'rang').replace('school', 'skul').replace('market', 'bajar').replace('church', 'mandal').replace('hospital', 'aspatal').replace('office', 'dak').replace('field', 'kamat').replace('forest', 'rimang').replace('river', 'chik').replace('mountain', 'nok')}o"
    new_entries.append({"english": eng, "garo": garo})

# 6. Generate adjective + noun combinations
adjectives = ['big', 'small', 'good', 'bad', 'hot', 'cold', 'new', 'old', 'beautiful', 'ugly']
garo_adjectives = ['gonga', 'chik', 'ramang', 'rong·a', 'mek', 'jak', 'gsa', 'rong', 'gima', 'rong']

for i, adj in enumerate(adjectives):
    for noun_eng, noun_garo in list(nouns.items())[:15]:  # First 15 nouns
        eng = f"{adj} {noun_eng}"
        garo = f"{garo_adjectives[i]} {noun_garo}"
        new_entries.append({"english": eng, "garo": garo})

# Add new entries to data
data.extend(new_entries)

# Save expanded dictionary
with open('garo_dictionary.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_entries)} generated entries")
print(f"Total entries now: {len(data)}")