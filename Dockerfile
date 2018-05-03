FROM python:3.6

# Set working directory
WORKDIR /usr/src/app

# Install pytest
RUN pip install pytest

# Copy our code
COPY . .

# Run tests
CMD ["pytest", "./main.py"]