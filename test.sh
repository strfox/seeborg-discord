rm -r ./htmlcov/
rm .coverage
py.test --cov=src/
coverage html