import pandas as pd
import glob

li = []

id_name = "MASK_ID"

for filename in glob.glob("../synthetic_data/trial_1/*.csv"):
    print(filename)
    df = pd.read_csv(filename, index_col=False)
    sub_li = []
    for col_name in list(df):
        sub_df = df.groupby([id_name])[col_name].apply(list)
        try:
            sub_df[id_name] = df[id_name].apply(lambda x: x[0])
        except:
            pass
        sub_li.append(sub_df)
    df = pd.concat(sub_li, axis=1)
    li.append(df)

frame = pd.concat(li, axis=1)
del frame[id_name]

# frame.to_json("../parsed_data/"+ filename + ".json")
frame.to_csv("../parsed_data/combined_trail_1.csv")