FROM python:3.10.8

RUN mkdir -p /app/backend /app/Data

COPY /Data /app/Data
COPY requirements.txt /app/backend/requirements.txt

COPY . /app/backend

WORKDIR /app/backend

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
