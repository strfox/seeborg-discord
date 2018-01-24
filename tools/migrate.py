from src import database
import sys
import cProfile

in_txt = sys.argv[1]
db_out = sys.argv[2]

database.init_db(db_out)


def main():
    with open(in_txt, 'rb') as f:
        exceptions = []
        for line in f:
            print(line)
            if line == b'' or line == b'\n':
                continue
            line = line.decode('utf-8', errors='ignore')
            try:
                database.insert_line(line)
            except Exception as e:
                exceptions.append(e)
        print('Failures: %s' % '\n'.join([str(x) for x in exceptions]))
        print('Finished with %s failures' % len(exceptions))


main()
