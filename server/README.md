# Server Setup Guide

Follow these steps to set up and configure your server environment properly.

## 1. Create a Python Virtual Environment

If you don’t have a virtual environment set up, create one:

```sh
python -m venv venv
```

Activate the virtual environment:

- **Windows:**
  ```sh
  venv\Scripts\activate
  ```
- **Mac/Linux:**
  ```sh
  source venv/bin/activate
  ```

## 2. Install Required Dependencies

Ensure all necessary libraries are installed:

```sh
pip install -r requirements.txt
```

## 3. Install `python-dotenv`

If `python-dotenv` is not already installed, install it to manage environment variables:

```sh
pip install python-dotenv
```

## 4. Set Up Database Configuration

Create a configuration file named `configuration.cnf` in the project's root directory with the following content:

```ini
[client]
database = your_database_name
user = your_mysql_username
password = your_mysql_password
host = localhost
port = 3306
default-character = utf8
```

Ensure this file is added to `.gitignore` to prevent exposing sensitive credentials.

## 5. Run Database Migrations (If Applicable)

If your project uses migrations, apply them using:

```sh
python manage.py migrate
```

## 6. Start the Server

Run the following command to start the server:

```sh
python manage.py runserver
```

Your server should now be set up and running. Access it in your browser at `http://127.0.0.1:8000/`.

---

Your server environment is now fully configured and ready for use!
