rd /s htmlcov\
del /p .coverage
py.test --cov=src/
coverage html