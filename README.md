# Blackjack Web Application
This full-stack web application implements the class casino Blackjack game, built with Django and React.

## Features
- User authentication system
- Real-time game statistics tracking
- Interactive game interface
- Balance tracking system
- Profile page with balance history visualization

## Tech stacks
### Frontend
- React
- Tailwind CSS
- Recharts from React

### Backend
- Django
- Django REST Framework
- JWT Authentication
- SQLite Database

## Installation
1. Clone the repository
```
git clone https://github.com/stanleytengg/Blackjack-Web-App.git
cd Black-Web-App
```
2. Create and activate virtual environment
```
cd backend
python -m venv venv
source venv/bin/activate

# For Window users, use this instead
venv\Scripts\activate
```
3. Install the required dependencies
```
pip install -r requirements.txt
```
4. Setup the database
```
python manage.py makemigrations
python manage.py migrate
```
5. Setup the frontend
```
cd ..
cd frontend
npm install
```
## Start servers
In two terminals, start both servers
### Backend
```
cd backend
python manage.py runserver
```
### Frontend
```
cd frontend
npm start
```
