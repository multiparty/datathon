import glob
import csv

filenames = glob.glob("../synthetic_data/trial_1/*.csv");

MASK_ID = 0;

print(glob)
print(filenames);

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
          parsed_file[patient_id][field] = [];

        parsed_file[patient_id][field].append(value);

for patient in parsed_file:
  print(field)
  # for field in patient:
    # # if len(parsed_file[patient][field]) === 1:
    #   print
    
    # for row in rdr:
      # print(row);