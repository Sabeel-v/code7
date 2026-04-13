import sys
from sqlalchemy import create_engine, text
from core.config import settings

engine = create_engine(settings.DATABASE_URL)

def run_alter():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE leads ADD COLUMN source VARCHAR DEFAULT 'Website' NOT NULL;"))
            print("Added source to leads.")
        except Exception as e:
            print(f"Error adding source to leads (might exist): {e}")
            
        try:
            conn.execute(text("ALTER TABLE leave_requests ADD COLUMN leave_type VARCHAR DEFAULT 'Sick Leave' NOT NULL;"))
            print("Added leave_type to leave_requests.")
        except Exception as e:
            print(f"Error adding leave_type to leave_requests (might exist): {e}")

if __name__ == "__main__":
    run_alter()
