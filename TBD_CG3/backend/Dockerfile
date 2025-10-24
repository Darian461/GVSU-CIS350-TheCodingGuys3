# Use a lightweight Python image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy backend code into the container
COPY . /app/backend

# Install dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Expose FastAPI port
EXPOSE 8000

# Run the FastAPI app as a package (important!)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]



