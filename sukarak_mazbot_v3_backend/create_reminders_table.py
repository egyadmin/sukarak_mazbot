from app.db.session import engine
from app.models.health import MedicineReminder
MedicineReminder.__table__.create(engine, checkfirst=True)
print("medicine_reminders table created!")
