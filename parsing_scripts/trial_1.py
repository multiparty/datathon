import glob
import csv
import json

filenames = glob.glob("../synthetic_data/trial_1/*.csv");

MASK_ID = 0;

parsed_file = {};

for f in filenames:
  with open(f, 'rb') as csvfile: 
    rdr = csv.reader(csvfile, delimiter=",")
    hdr = rdr.next();

    for row in rdr:
      patient_id = row[MASK_ID];
      
      # add patient if patient is not in file
      if patient_id not in parsed_file:
        parsed_file[patient_id] = {};

      for i in range(len(row)): 
        parsed_file[patient_id] = {};
        value = row[i];
        field = hdr[i];

        if field not in parsed_file[patient_id]:
          # print(field);
          patient_row = parsed_file[patient_id];
          patient_row[field] = {};


        #   parsed_file[patient_id][field] = [];
          # parsed_file[patient_id][field] = [];
          # print(field)

        # parsed_file[patient_id][field].append(value);

with open('../parsed_data/trial1_parsed.json', 'wb') as json_file:
  json.dump(parsed_file, json_file);


# print(parsed_file)
# for patient in parsed_file:
#   for field in parsed_file[patient]:
#   # print(field) .
#     print(field, parsed_file[patient][field])
  # for field in patient:
    # # if len(parsed_file[patient][field]) === 1:
    #   print
    
    # for row in rdr:
      # print(row);