#!/usr/bin/env bash

if ! command -v code-insiders &> /dev/null
then
  code ./frontend
  code ./backend
  exit 1
else
  code-insiders ./frontend
  code-insiders ./backend
  exit 1
fi
