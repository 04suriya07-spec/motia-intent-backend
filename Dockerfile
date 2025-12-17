FROM node:20-slim

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Memory Optimization: Set Node memory limit to avoid OOM on free tiers
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# Copy repo
COPY . .

# Install dependencies (frozen lockfile for speed/safety)
RUN pnpm install --frozen-lockfile

# 1. Build the Intent Compiler (It's a tool, not a dependency of playground)
WORKDIR /app/tools/intent-compiler
RUN pnpm build

# 2. Generate the Backend Steps
WORKDIR /app
# Generate steps into the example folder
RUN node tools/intent-compiler/dist/index.js generate examples/intent-backend/intent.yaml --force

# 3. CRITICAL: Copy generated steps into Playground's plugins folder
# so they are loaded by the running server.
# We also need db.ts at ../db (relative to steps)
RUN mkdir -p playground/plugins/intent-backend
RUN cp -r examples/intent-backend/generated/* playground/plugins/intent-backend/
RUN cp examples/intent-backend/db.ts playground/plugins/db.ts

# 4. Fix Runtime Dependency: Playground needs 'mongodb' for db.ts
WORKDIR /app/playground
RUN pnpm add mongodb

# 5. Build ONLY the Playground and its dependencies (Save Memory!)
# This skips docs, e2e, and other heavy unrelated packages.
WORKDIR /app
RUN pnpm --filter=playground... run build

# 6. Run the Playground
WORKDIR /app/playground
EXPOSE 3000
CMD ["pnpm", "dev"]
