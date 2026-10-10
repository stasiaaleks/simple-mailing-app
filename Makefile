.PHONY: help install dev db-up db-down db-reset

help:
	@echo "Available targets:"
	@echo "  install - Install dependencies"
	@echo "  dev - Start the application"
	@echo "  db-up - Start MongoDB container"
	@echo "  db-down - Stop MongoDB container"
	@echo "  db-reset - Reset MongoDB (delete data)"

install:
	npm install

dev:
	npm start

db-up:
	docker compose up -d

db-down:
	docker compose down

db-reset:
	docker compose down -v
