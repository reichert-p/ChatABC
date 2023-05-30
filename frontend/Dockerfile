FROM nginx

# Copy the static files to the appropriate directory
COPY . /usr/share/nginx/html

# Expose the port on which the server will listen
EXPOSE 80

# Start the server
CMD ["nginx", "-g", "daemon off;"]