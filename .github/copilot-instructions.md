# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a full-stack task management application built with:

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and App Router
- **Backend**: Express.js API server with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication

## Project Structure

- `/src/app` - Next.js App Router pages and components
- `/src/components` - Reusable React components
- `/server` - Express.js backend API
- `/server/models` - MongoDB/Mongoose models
- `/server/routes` - API route handlers
- `/server/controllers` - Business logic controllers
- `/server/middleware` - Express middleware

## Key Features

- Task management with different statuses (Todo, In Progress, Done)
- Subtasks support for each main task
- Drag-and-drop Kanban board interface
- User authentication and authorization
- Real-time updates (future enhancement)

## Coding Guidelines

- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling
- Use environment variables for configuration
- Follow RESTful API design principles
- Use Mongoose for database operations

## Database Schema

- **User**: Authentication and user management
- **Task**: Main tasks with title, description, status, assignee
- **Subtask**: Nested tasks belonging to main tasks
- **Board**: Task organization (future enhancement)

