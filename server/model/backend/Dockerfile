FROM python:3.10.8

RUN mkdir -p /app/backend /app/Data

COPY /Data /app/Data
COPY /backend/requirements.txt /app/backend/requirements.txt

COPY /backend /app/backend

WORKDIR /app/backend

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
