import pandas as pd
import ast

def select(path_to_file, variables, output_path):
    df = pd.read_csv(path_to_file)
    # add primary key
    primary_key = list(df)[0]
    primary_col = df[primary_key]
    df = df[variables]
    # df = df.applymap(lambda x: ast.literal_eval(x)[0] if x not in ['AGEGR1N', "AVAL", 'TRTAN', "DIAGDUR", "METDDUR", "DTHFL", "SUBJID"] else x)
    df = df.applymap(lambda x: x[1:-1])
    for var in variables:
        df = df[df[var] != "nan"]
    df[primary_key] = primary_col
    df.to_csv(output_path, index=False)

if __name__ == "__main__":
    path_to_file = "../parsed_data/combined_trial_2.csv"
    variables = ['AGEGR1N', "AVAL", 'TRTAN', "DIAGDUR", "METDDUR", "DTHFL"]
    output_path = "../parsed_data/filtered_trial_2.csv"

    filter_df = select(path_to_file=path_to_file, variables=variables, output_path=output_path)