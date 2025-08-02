FROM nvidia/cuda:12.1.1-base-ubuntu22.04

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip git

# Install vLLM
RUN pip3 install --upgrade pip && pip3 install vllm

# Expose port for API
EXPOSE 8000

# Command to run vLLM
CMD ["vllm", "serve", "Qwen/Qwen2.5-Coder-0.5B-Instruct", "--trust-remote-code", "--served-model-name", "qwen-chat", "--gpu-memory-utilization", "0.85", "--device", "cpu"]
