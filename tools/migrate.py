from src import database
import sys

in_txt = sys.argv[1]
db_out = sys.argv[2]

database.init_db(db_out)

with open(in_txt, 'rb') as f:
    for line in f:
        line = line.decode('utf-8', errors='ignore')
        print('INSERT %s' % line)
        try:
            database.insert_line(line)
        except ValueError as e:
            print('COULD NOT INSERT LINE: %s' % line)
