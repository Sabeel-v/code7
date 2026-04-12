import traceback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings
from models.user import User

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()
try:
    print("Trying to query User table...")
    user = db.query(User).first()
    print("Query successful. Trying to insert...")
    new_user = User(
        email="test_crash@example.com",
        full_name="Crash Test",
        hashed_password="fake",
        role="Employee",
        created_by=1
    )
    db.add(new_user)
    db.commit()
    print("Insert successful!")
    # rollback so we don't pollute
    db.delete(new_user)
    db.commit()
except Exception as e:
    print("\n--- DATABASE ERROR CAUGHT ---")
    print(traceback.format_exc())
finally:
    db.close()
