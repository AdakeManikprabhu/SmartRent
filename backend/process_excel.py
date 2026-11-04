import pandas as pd
import json
import sys

# Set stdout encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

excel_path = r"C:\Users\mpada\OneDrive\Desktop\Bangalore_Smart_Rent_PG_Dataset_115_Yelahanka.xlsx"
df = pd.read_excel(excel_path)

records = df.to_dict(orient='records')

with open(r"c:\Users\mpada\OneDrive\SmartRent\backend\src\main\resources\yelahanka_pg_dataset.json", "w", encoding="utf-8") as f:
    json.dump(records, f, indent=2, default=str)

print(f"SUCCESS: Exported {len(records)} PG records to yelahanka_pg_dataset.json")
print("Columns list:")
for col in df.columns:
    print(f"  * {col}")
