# Base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

#envoronement port
ENV PORT 3000

# Expose the port that the application listens on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
