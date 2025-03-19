import hashlib
import pandas as pd
import json

file_path = "patients.csv"
df = pd.read_csv(file_path)

df_filtered = df[["Id", "BIRTHDATE", "DEATHDATE", "GENDER", "RACE", "ETHNICITY"]]

transactions = []

for _, row in df_filtered.iterrows():
    patient_data = {
        "id": row["Id"],
        "birthdate": row["BIRTHDATE"],
        "deathdate": row["DEATHDATE"] if pd.notna(row["DEATHDATE"]) else None,
        "gender": row["GENDER"],
        "race": row["RACE"],
        "ethnicity": row["ETHNICITY"]
    }
    
    # Convert to JSON string and hash
    data_string = json.dumps(patient_data, sort_keys=True)
    data_hash = hashlib.sha256(data_string.encode()).hexdigest()

    transactions.append({
        "patient": row["Id"],
        "dataHash": data_hash
    })

# Save transactions to JSON file
output_file = "processed_transactions.json"
with open(output_file, "w") as file:
    json.dump(transactions, file, indent=4)

print(f"Processed {len(transactions)} patient records. Saved to {output_file}")
