from src import database
import sys

in_txt = sys.argv[1]
db_out = sys.argv[2]

database.init_db(db_out)

buffer = []
MAX_BUFFER_SIZE = 10000

exceptions = []

with open(in_txt, 'rb') as f:
    for line in f:
        line = line.decode('utf-8', errors='ignore')
        if len(buffer) < MAX_BUFFER_SIZE:
            buffer.append(line)
        else:
            print(buffer)
            try:
                database.insert_bulk(buffer)
            except Exception as e:
                exceptions.append(e)
            buffer = []

print('Failures: %s' % '\n'.join([str(x) for x in exceptions]))
print('Finished with %s failures' % len(exceptions))
