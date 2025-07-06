#!/bin/bash
# Simple script to start backend and frontend
cd backend && npm start &
cd ../frontend/web && npm start