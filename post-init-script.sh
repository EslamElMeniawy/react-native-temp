#!/bin/bash

echo "Running post-init script..."

echo "Installing bundle..."
bundle install

echo "Enabling corepack..."
corepack enable

echo "Post-init script completed!"
