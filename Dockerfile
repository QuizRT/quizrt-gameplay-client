# Use an official Angular Node runtime as a parent image
FROM node

# Set the working directory to /app
RUN mkdir /app
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli
RUN npm install @aspnet/signalr

# Copy the current directory contents into the container at /app
COPY . /app

# Define environment variable
# ENV NAME World
EXPOSE 4200

# Run app.py when the container launches
CMD ["npm", "start"]
