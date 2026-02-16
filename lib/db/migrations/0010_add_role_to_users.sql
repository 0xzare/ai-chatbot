-- Migration: Add role column to User table for rule-based user management

ALTER TABLE "User" ADD COLUMN "role" varchar(255) NOT NULL DEFAULT 'user';