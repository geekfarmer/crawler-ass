FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install
# pm2 to manage my process within the container
# RUN npm install pm2 -g

# Bundle app source
COPY . ./

EXPOSE 3000
# process.json ----config file for pm2
CMD ["npm", "start"]