FROM node:20-slim

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ packages/
COPY plugins/ plugins/
COPY tools/ tools/
COPY examples/ examples/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Compiles the intent compiler
WORKDIR /app/tools/intent-compiler
RUN pnpm build

# Go back to root
WORKDIR /app

# Generate the example steps (just to be safe/fresh)
RUN node tools/intent-compiler/dist/index.js generate examples/intent-backend/intent.yaml --force

# Expose the API port (default 3000 for Motia)
EXPOSE 3000

# Start the Motia server
# Note: In a real deployment, we'd use the generated steps. 
# Motia dev server picks up changes.
CMD ["pnpm", "dev"]
