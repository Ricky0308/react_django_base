FROM node:20

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH

COPY ./frontend/package*.json /frontend/

RUN npm install

EXPOSE 3000

# The command to run your application
CMD ["npm", "start"]
# CMD ["sh"]