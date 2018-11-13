FROM python:3.6

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy our code
COPY . .

# Run flask web server
CMD ["python", "./main.py"]