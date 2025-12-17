FROM node:20-slim

# 1. Install System Dependencies (Python + Build Tools)
# 'motia install' and some native modules need python3/make/g++
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# 2. Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Memory Optimization
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# Copy repo
COPY . .

# 3. Install dependencies
RUN pnpm install --frozen-lockfile

# 4. Build the Intent Compiler
WORKDIR /app/tools/intent-compiler
RUN pnpm build

# 5. Generate and Install the Backend Steps
WORKDIR /app
RUN node tools/intent-compiler/dist/index.js generate examples/intent-backend/intent.yaml --force

# Copy generated steps into Playground
RUN mkdir -p playground/plugins/intent-backend
RUN cp -r examples/intent-backend/generated/* playground/plugins/intent-backend/
RUN cp examples/intent-backend/db.ts playground/plugins/db.ts

# 6. Fix Runtime Dependency for db.ts
WORKDIR /app/playground
RUN pnpm add mongodb

# 7. Build Dependencies (The Fix!)
# We build everything playground DEPENDS on (core, plugins, etc), NOT playground itself.
# '^...' means "dependencies of", preventing "missing script: build" error.
WORKDIR /app
RUN pnpm --filter=playground^... run build

# 8. Run
WORKDIR /app/playground
EXPOSE 3000
CMD ["pnpm", "dev"]
