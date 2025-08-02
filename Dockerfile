FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y python3-pip git && rm -rf /var/lib/apt/lists/*

# Install vLLM
RUN pip install --upgrade pip && pip install vllm

# Expose API port
EXPOSE 8000

# Render provides PORT env, so forward it
ENV PORT=8000

# Run vLLM in CPU mode and bind to PORT
CMD ["sh", "-c", "vllm serve Qwen/Qwen2.5-Coder-0.5B-Instruct --trust-remote-code --served-model-name qwen-chat --device cpu --port $PORT"]