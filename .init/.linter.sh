#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-to-do-list-app-198228-198249/todo_react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

