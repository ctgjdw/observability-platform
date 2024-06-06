FROM python:3.10

WORKDIR /code

COPY . .

RUN pip install poetry && poetry config virtualenvs.create false && poetry install && opentelemetry-bootstrap -a install

ENTRYPOINT [ "opentelemetry-instrument", "uvicorn", "src.main:app", "--port", "8000", "--host", "0.0.0.0"]