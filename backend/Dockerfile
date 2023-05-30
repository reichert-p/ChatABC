FROM node:14

# Set the working directory
WORKDIR /app

# Copy the server files to the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose the port on which the server will listen
EXPOSE 3000

# Start the server
CMD ["npm", "start"]