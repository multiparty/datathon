import pandas as pd
import glob

def combine(path_to_files, primary_key, output_path):
    li = []

    for filename in glob.glob(path_to_files):
        print(filename)
        df = pd.read_csv(filename, index_col=False)
        if filename == "../synthetic_data/trial_2\syn_adef.csv":
            print(len(df))
            df = df[df["PARAMCD"] == "TIME2DTH"]
            print(len(df))
        sub_li = []
        for col_name in list(df):
            sub_df = df.groupby([primary_key])[col_name].apply(list)
            try:
                sub_df[primary_key] = df[primary_key].apply(lambda x: x[0])
            except:
                pass
            sub_li.append(sub_df)
        df = pd.concat(sub_li, axis=1)
        li.append(df)

    frame = pd.concat(li, axis=1)
    del frame[primary_key]
    frame = frame.dropna()
    frame.to_csv(output_path)

if __name__ == "__main__":
    # path_to_files = "../synthetic_data/trial_1/*.csv"
    # primary_key = "MASK_ID"

    path_to_files = "../synthetic_data/trial_2/*.csv"
    primary_key = "SUBJID"
    output_path = "../parsed_data/combined_trial_2.csv"

    filter_df = combine(path_to_files=path_to_files, primary_key=primary_key, output_path=output_path)