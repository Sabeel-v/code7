import os
import subprocess
from datetime import datetime

def backup_database():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"database_backup_{timestamp}.sql"
    
    # We use the database URL specified in .env by the user previously
    postgres_url = "postgresql://sabeel_dev:sabeel8075@localhost/business_crm_db"
    
    print(f"Starting backup of database to {backup_file}...")
    try:
        # Executes pg_dump. pg_dump must be in system PATH
        subprocess.run(["pg_dump", postgres_url, "-f", backup_file], check=True)
        print(f"Backup successful: {backup_file}")
    except subprocess.CalledProcessError as e:
        print(f"Backup failed during pg_dump execution. Error: {e}")
    except FileNotFoundError:
        print("ERROR: pg_dump utility not found! Please ensure PostgreSQL tools are installed and added to your system PATH.")

if __name__ == "__main__":
    backup_database()
