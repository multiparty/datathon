import pandas as pd

def select(fname, variables):
    df = pd.read_csv(fname)
    df = df[variables]
    df.to_csv("../parsed_data/filtered_trail_1.csv")

if __name__ == "__main__":
    filter_df = select("../parsed_data/combined_trail_1.csv", ["SOC_TXT", "AGE_C"])