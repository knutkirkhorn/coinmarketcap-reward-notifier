FROM node:16-alpine

# Set application directory
WORKDIR /usr/src/app

COPY package*.json ./

# Use npm ci to only install `dependencies` and not `devDependencies`
RUN npm ci --only=production

COPY . .

CMD ["node", "index.js"]
