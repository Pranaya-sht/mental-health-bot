import pandas as pd

# Load datasets and inspect columns
faq_df = pd.read_csv('Mental_Health_FAQ_1.csv')
print("\nFAQ Dataset columns:", faq_df.columns.tolist())
print(f"Loaded FAQ dataset with {len(faq_df)} entries")

helios_df = pd.read_csv('mental_health_chatbot_dataset.csv')
print("\nHelios Dataset columns:", helios_df.columns.tolist())
print(f"Loaded heliosbrahma dataset with {len(helios_df)} entries")

amod_df = pd.read_csv('mental_health_counseling_conversations.csv')
print("\nAmod Dataset columns:", amod_df.columns.tolist())
print(f"Loaded Amod dataset with {len(amod_df)} entries")

def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and preprocess the combined dataset.
    """
    # Remove any rows with empty questions or answers
    df = df.dropna(subset=['Questions', 'Answers'])
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['Questions', 'Answers'])
    
    # Basic text cleaning
    df['Questions'] = df['Questions'].str.strip()
    df['Answers'] = df['Answers'].str.strip()
    
    return df

# Transform heliosbrahma dataset based on actual column names
try:
    helios_transformed = pd.DataFrame({
        'Questions': helios_df['Human'] if 'Human' in helios_df.columns else helios_df['human'],
        'Answers': helios_df['Bot'] if 'Bot' in helios_df.columns else helios_df['bot']
    })
except KeyError as e:
    print(f"\nError with helios dataset columns. Available columns are: {helios_df.columns.tolist()}")
    raise e

# Transform Amod dataset based on actual column names
try:
    # First, let's see what columns are actually available
    print("\nAmod dataset first few rows:")
    print(amod_df.head())
    
    amod_transformed = pd.DataFrame({
        'Questions': amod_df['Context'] if 'Context' in amod_df.columns else amod_df['CONTEXT'],
        'Answers': amod_df['Response'] if 'Response' in amod_df.columns else amod_df['RESPONSE']
    })
except KeyError as e:
    print(f"\nError with amod dataset columns. Available columns are: {amod_df.columns.tolist()}")
    raise e

# Combine all datasets
combined_df = pd.concat([
    faq_df,
    helios_transformed,
    amod_transformed
], ignore_index=True)

# Clean the combined dataset
combined_df = clean_dataset(combined_df)
combined_df.to_csv('combined_mental_health_dataset.csv', index=False)
print(f"\nCombined dataset created with {len(combined_df)} entries")