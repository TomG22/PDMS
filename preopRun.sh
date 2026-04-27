#!/bin/bash 

# comment
set -e

git pull 

git clean -Xfd

cd frontend 

pnpm install --frozen-lockfile
