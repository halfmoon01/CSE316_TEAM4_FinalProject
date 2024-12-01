# CSE316_TEAM4_FinalProject
This is for CSE 316 Final Project. Our team number is 4, and we are Hyeseong Bak and Sanghyun Jun

# Project Structure Description

This project consists of **backend** and **frontend** components, which need to be set up separately. Below is a guide for configuring and running the project.

## Folder Structure

- **`backend/`**  
  Contains backend-related files.  
  **`index.js`** is the main file that handles server connections and API routes.

- **`frontend/`**  
  Contains frontend-related files for the user interface.

## Initial Setup

### 1. Download the submitted .zip file
Unzip the file

### 2. Install Dependencies
Navigate to the `backend` folder and run:
`cd backend`
`npm install`

Navigate to the `frontend` folder and run:
`cd ../frontend`
`npm install`

### 3. Setup Database
Database file is located under `database` folder.
In command line, type:
`mysql -u <YOUR USER NAME> -p < <directory of the .sql file provided>`
If passwords not match, permission issue might occur. In this case, please fix the `PASSWORD` in `.env` file, located under `backend` folder.

### 4. Running the Project
To start the **backend server**, run the following command inside the `backend` folder:
`node index.js`

To start the **fronted development server**, run the following command inside the `frontend` folder:
`npm run dev`

## Additional Notes
Ensure you have Node.js and npm installed on your system.
The backend server runs on http://localhost:8080 by default.
The frontend development server runs on http://localhost:5173.