from fastapi import FastAPI,Path,HTTPException,Depends,status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine,Sessionlocal
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer


app = FastAPI()
models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/")
async def welcome():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def hello(name):
   return {"Hello": name}

@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}

class UniversityBase(BaseModel):
    uni_id: int
    name: str

class UserBase(BaseModel):
    user_id: str
    user_name: str
    password: str
    email: str
    role: str

class PaymentBase(BaseModel):
    payment_id: int
    amount: float
    date: str
    timestamp: str
    user_id: str

class NotificationBase(BaseModel):
    notification_id: str
    user_id: str
    date: str
    timestamp: str
    message: str
    status: bool

class PackageBase(BaseModel):
    package_id: str
    amount: float
    duration: str
    no_of_boardings: int

class LandlordBase(BaseModel):
    landlord_id: str
    name: str
    contact: int
    profile_pic: str
    account_no: str
    address: str
    user_id: str
    package_id: str

class BoardingBase(BaseModel):
    boarding_id: str
    uni_id: int
    landlord_id: str
    img: str
    price_range: str
    location: str
    rating: float
    review: str
    type: str
    security: str
    available_space: int

class StudentBase(BaseModel):
    student_id: str
    boarding_id:str
    account_no:str
    contact:int
    address:str
    profile_pic:str
    user_id: str
    
def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

db_dependancy = Annotated[Session,Depends(get_db)]

@app.post("/users/",status_code=status.HTTP_201_CREATED)
async def create_user(user:UserBase,db:db_dependancy):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()

@app.get("/users/{user_id}",status_code=status.HTTP_200_OK)
async def read_user(user_id:str,db:db_dependancy):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404,detail="User not found")
    return user
