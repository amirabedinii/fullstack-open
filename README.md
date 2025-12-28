# Full Stack Open

My solutions for the [Full Stack Open](https://fullstackopen.com/) course by the University of Helsinki.

## 🌐 Live Demo

The phonebook app is live at: https://fullstack-open-l2sb.onrender.com/

## 📁 Repository Structure

### Part 0 - Fundamentals of Web apps
Sequence diagrams illustrating how web applications work.

| Exercise | Description |
|----------|-------------|
| `new_note_creation_04.md` | Diagram for traditional note creation |
| `single_page_app_05.md` | Diagram for SPA loading notes |
| `new_note_spa_06.md` | Diagram for SPA note creation |

### Part 1 - Introduction to React
Introduction to React concepts: components, state, and event handlers.

| Project | Description |
|---------|-------------|
| `courseinfo` | Display course information with nested components |
| `unicafe` | Feedback app with statistics using React state |
| `anecdotes` | Random anecdotes app with voting functionality |

### Part 2 - Communicating with server
Working with forms, fetching data from servers, and styling React apps.

| Project | Description |
|---------|-------------|
| `courseinfo` | Extended version with modular components |
| `phonebook` | Contact management app with REST API integration |

### Part 3 - Programming a server with NodeJS and Express
Building a backend with Node.js, Express, and MongoDB.

| Project | Description |
|---------|-------------|
| `phonebook` | REST API backend with MongoDB, deployed to Render |

### Part 4 - Testing Express servers, user administration
Testing Express applications, user administration, and token authentication.

| Project | Description |
|---------|-------------|
| `blog` | Blog API backend with JWT authentication, user management, and comprehensive test suite |

## 🛠️ Technologies Used

- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Testing**: Supertest
- **Deployment**: Render
- **Linting**: ESLint

## 🚀 Running Locally

### Frontend (part1 & part2)
```bash
cd part2/phonebook
npm install
npm run dev
```

### Backend (part3)
```bash
cd part3/phonebook
npm install
npm run dev
```

### Backend (part4)
```bash
cd part4/blog
npm install
npm run dev
```

### Running Tests (part4)
```bash
cd part4/blog
npm test
```

Requires a `.env` file with `MONGODB_URI` for database connection. Part4 also requires `SECRET` for JWT token signing.
