FROM python:3.8-slim

RUN ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    ln -fs /usr/bin/python3 /usr/bin/python
RUN apt-get update &&\
    apt-get install --yes curl\
    default-mysql-client\
    python3-dev\
    default-libmysqlclient-dev\
    gcc

WORKDIR /backend
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY backend /backend/
# setup.sh is for aliases 
RUN echo "source /backend/setup.sh" >> $HOME/.bashrc
COPY docker/backend/requirements.txt /backend/


RUN pip install -r requirements.txt 
CMD /bin/bash

# docker image build -f docker/backend/.dockerfile -t backend .
# docker container run --rm --name backend -v C:/Users/Chidu/NFT-secondhand/backend -it -p 8000:8000 backend
# python manage.py runserver 0.0.0.0:8000