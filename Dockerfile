FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
  gcc-mingw-w64 \
  wine \
  curl \
  && apt-get clean

# Установим rustup и компилятор для Windows
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add x86_64-pc-windows-gnu

# Устанавливаем Tauri CLI
RUN cargo install tauri-cli

# build for windows
#docker build -t tauri-cross-compile .
#docker run -v "$(pwd):/app" tauri-cross-compile
