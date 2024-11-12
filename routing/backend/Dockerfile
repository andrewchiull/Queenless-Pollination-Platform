# Use the official Python image
FROM python:3.12

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

# Copy the rest of the application code
COPY . .

# Start the FastAPI application
CMD ["fastapi", "run", "main.py", "--port", "5001"]