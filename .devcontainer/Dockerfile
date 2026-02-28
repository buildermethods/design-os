FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

RUN npx playwright install --with-deps chromium
RUN su node -c "curl -fsSL https://claude.ai/install.sh | bash"
