-include .env

.PHONY: help install dev db-up db-down db-reset db-shell

help:
	@echo "Available targets:"
	@echo "  install - Install dependencies"
	@echo "  dev - Start the application"
	@echo "  db-up - Start MongoDB container"
	@echo "  db-down - Stop MongoDB container"
	@echo "  db-reset - Reset MongoDB (delete data)"
	@echo "  db-shell - Open mongosh in the MongoDB container"

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

db-shell:
	docker compose exec mongodb mongosh "$(MONGODB_URI)"
