import pandas as pd

def select(path_to_file, variables, output_path):
    df = pd.read_csv(path_to_file)
    # add primary key
    variables = [list(df)[0]] + variables
    df = df[variables]
    df.to_csv(output_path, index=False)

if __name__ == "__main__":
    path_to_file = "../parsed_data/combined_trial_2.csv"
    variables = ['AGEGR1N', "AVAL", 'TRTAN', "DIAGDUR", "METDDUR", "DTHFL"]
    output_path = "../parsed_data/filtered_trial_2.csv"

    filter_df = select(path_to_file=path_to_file, variables=variables, output_path=output_path)