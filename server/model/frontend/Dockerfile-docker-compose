# Frontend/Dockerfile

FROM python:3.10.8

RUN mkdir -p app/frontend

COPY /model/frontend app/frontend

WORKDIR /app/frontend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python", "Generate_Recommendations.py"]
