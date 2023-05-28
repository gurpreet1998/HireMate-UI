
# Use an official Node.js runtime as the base image
FROM node:16
# Set the working directory in the container
WORKDIR /hiremateapp
ENV PATH /app/node_modules/.bin:$PATH
# Copy package.json and package-lock.json to the working directory
COPY package.json yarn.lock ./
# Install the project dependencies
RUN yarn install --force
RUN yarn install
# Install additional dependencies
RUN yarn global add react-scripts@5.0.1 -g --silent
RUN yarn global add vite
RUN yarn add @tanstack/react-query
# Copy the rest of the application code
COPY . .
# Expose the port your application listens on (replace <port> with the actual port number)
EXPOSE 5173
# Specify the command to run your application
CMD ["yarn", "run", "dev", "--", "--host" ]
