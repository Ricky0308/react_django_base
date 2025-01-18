FROM python:3.8-slim

# Set timezone and create symbolic links
RUN ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    ln -fs /usr/bin/python3 /usr/bin/python

# Install dependencies
RUN apt-get update &&\
    apt-get install --yes curl\
    default-mysql-client\
    python3-dev\
    default-libmysqlclient-dev\
    gcc

# Set working directory
WORKDIR /backend

# Environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy application code
COPY backend /backend/
COPY docker/backend/requirements.txt /backend/


# Install Python dependencies
RUN pip install -r requirements.txt 
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# docker image build -f docker/backend/.dockerfile -t backend .
# docker container run --rm --name backend -v C:/Users/Chidu/NFT-secondhand/backend -it -p 8000:8000 backend
# python manage.py runserver 0.0.0.0:8000