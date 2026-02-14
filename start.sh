#!/bin/bash
# Start backend in background
export PYTHONPATH=$PYTHONPATH:$(pwd)/backend
python3 -m app.main &
BACKEND_PID=$!

# Start vite with custom config
# Use exec to replace shell with vite process, so signals propagate
exec node_modules/.bin/vite --config vite.custom.config.ts
