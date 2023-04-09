import pandas as pd

data_df = pd.read_csv('index.csv')


# There isn't an easy way to represent a list in a row in Excel, so just grab "tags" plus all the unnamed columns

only_tags_df = data_df.filter(regex=("tags|Unnamed:.*"))

tags_list_df = pd.DataFrame()


# squash all the columns to one column where each row is a list

tags_list_df['tags'] = only_tags_df.apply(lambda x: [c for c in x if not pd.isna(c)], axis=1)

no_tags_df = data_df.drop(columns=only_tags_df.columns)

result_df = no_tags_df.merge(tags_list_df, left_index=True, right_index=True)


result_df

json_str = result_df.to_json(orient='records')

with open("data/data.json", 'w') as f:
    f.write(json_str)
