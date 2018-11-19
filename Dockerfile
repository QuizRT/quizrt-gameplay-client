# Use an official Angular Node runtime as a parent image
FROM node: 8.11.4

# Set the working directory to /app
RUN mkdir /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./app

# Install any needed packages specified in requirements.txt
RUN npm install
RUN npm install @aspnet/signalr

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
# ENV NAME World

# Run app.py when the container launches
# CMD ["python", "app.py"]