# One-command shortcuts. Run `make` to see this list.
#
# Windows users: run these from Git Bash (installed with Git). If you don't
# have `make`, every target is just a couple of commands; see the README.

.PHONY: help install dev backend frontend test lint format docker-up docker-down

# The virtual environment puts executables in a different folder on Windows.
ifeq ($(OS),Windows_NT)
PYTHON := python
VENV_BIN := .venv/Scripts
else
PYTHON := python3
VENV_BIN := .venv/bin
endif

help:
	@echo "make install     install backend and frontend dependencies"
	@echo "make dev         run backend and frontend dev servers together"
	@echo "make backend     run only the Flask dev server (port 5000)"
	@echo "make frontend    run only the Vite dev server (port 5173)"
	@echo "make test        run backend tests"
	@echo "make lint        lint, type-check, and check formatting everywhere"
	@echo "make format      auto-format all code"
	@echo "make docker-up   build and run the production containers"
	@echo "make docker-down stop the production containers"

install:
	cd backend && $(PYTHON) -m venv .venv && $(VENV_BIN)/pip install -r requirements-dev.txt
	cd frontend && npm install

dev:
	@trap 'kill 0' INT; \
	$(MAKE) backend & \
	$(MAKE) frontend & \
	wait

backend:
	cd backend && $(VENV_BIN)/python wsgi.py

frontend:
	cd frontend && npm run dev

test:
	cd backend && $(VENV_BIN)/pytest

lint:
	cd backend && $(VENV_BIN)/ruff check . && $(VENV_BIN)/ruff format --check .
	cd frontend && npm run lint && npm run typecheck && npm run format:check

format:
	cd backend && $(VENV_BIN)/ruff format .
	cd frontend && npm run format

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down
