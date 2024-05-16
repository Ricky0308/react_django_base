FROM node:20-alpine

WORKDIR /workdir

ENV PATH /workdir/node_modules/.bin:$PATH

COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install

COPY /frontend /frontend/

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
