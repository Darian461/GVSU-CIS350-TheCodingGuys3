from database import get_session
from models import User

session = get_session()

new_user = User(
    username="church",
    email="church@example.com",
    password="testing"
)

session.add(new_user)
session.commit()
session.close()
