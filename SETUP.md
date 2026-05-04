# RecipeFinder Setup Instructions

## For Team Members

### 1. Create Virtual Environment
```bash
python -m venv env
```

### 2. Activate Virtual Environment
**Windows:**
```bash
env\Scripts\activate
```

**Mac/Linux:**
```bash
source env/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Django Development Server
```bash
cd tastybite
python manage.py runserver
```

## After Development

If you add new Python packages:
```bash
pip freeze > requirements.txt
```

This updates the requirements file so teammates can install the same versions.
