#!/bin/bash

# Generate a random JWT secret
secret=$(openssl rand -hex 32)
echo "Generated JWT Secret: $secret"

# Ask if the user wants to copy the secret to the clipboard
read -p "Do you want to copy this secret to clipboard? (Y/n) " answer

if [[ "$answer" == "Y" || "$answer" == "y" || -z "$answer" ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "$secret" | pbcopy
    echo "Secret copied to clipboard!"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xclip &>/dev/null; then
      echo "$secret" | xclip -selection clipboard
      echo "Secret copied to clipboard!"
    elif command -v xsel &>/dev/null; then
      echo "$secret" | xsel --clipboard --input
      echo "Secret copied to clipboard!"
    else
      echo "No clipboard utility found. Please install xclip or xsel."
    fi
  elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" ]]; then
    echo "$secret" | clip
    echo "Secret copied to clipboard!"
  else
    echo "Clipboard copy not supported on this OS."
  fi
fi
