# Admin Functionality Documentation

## Overview
This document outlines all admin-specific features and functionalities implemented in the application.

## Access Control
Admin access is controlled through multiple layers:
- Role-based authentication (`role: 'admin'` in users table)
- Protected routes using `withAdminProtection` HOC
- Protected API endpoints
- Protected UI elements

## Admin Features

### 1. Analytics Dashboard (`/dashboard/analytics`)
Protected analytics dashboard showing:
- Total page views
- Daily view statistics
- Most viewed pages
- User engagement metrics 
