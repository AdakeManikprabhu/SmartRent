import json
import re

json_path = r"c:\Users\mpada\OneDrive\SmartRent\backend\src\main\resources\yelahanka_pg_dataset.json"

with open(json_path, "r", encoding="utf-8") as f:
    records = json.load(f)

def clean_pg_name(raw_name):
    # Remove 'Yela', 'Basa', 'Indira', 'White', 'Marath' abbreviations inside name
    cleaned = re.sub(r'\b(Yela|Basa|Indira|White|Marath|Kora|Hsr)\b', '', raw_name, flags=re.IGNORECASE)
    # Remove trailing digits at the end of the name
    cleaned = re.sub(r'\s+\d+$', '', cleaned)
    # Clean up double spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

for item in records:
    old_name = item.get("PG Name", "")
    new_name = clean_pg_name(old_name)
    item["PG Name"] = new_name

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(records, f, indent=2, ensure_ascii=False)

print("Sample cleaned PG names:")
for item in records[:10]:
    print(" -", item["PG Name"])
