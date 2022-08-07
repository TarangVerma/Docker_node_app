FROM node:16
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "devlopment" ]; \
        then npm install; \ 
        else npm install --only=production; \
        fi

COPY . ./
EXPOSE 3000
CMD ["node" , "index.js"]
