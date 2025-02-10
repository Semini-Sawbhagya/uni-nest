from fastapi import FastAPI,Path,HTTPException,Depends,status
from pydantic import BaseModel
from typing import Annotated,List
import models
from database import engine,get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from Security.utils import hash_password
from sqlalchemy.sql import text
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

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
    user_name: str
    password: str
    email: str

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
    ratings: float
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

@app.get("/boardings/{uni_id}", response_model=List[BoardingBase], status_code=status.HTTP_200_OK)
async def get_boardings_by_uni(uni_id: int, db: db_dependancy):
    try:
        if not uni_id:
            raise HTTPException(status_code=400, detail="University ID is required")
        boardings = db.query(models.Boarding).filter(models.Boarding.uni_id == uni_id).all()
        if not boardings:
            raise HTTPException(status_code=404, detail="No boardings found for this university")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@app.get("/boardings-type/{type}",response_model=List[BoardingBase],status_code=status.HTTP_200_OK)
async def get_boarding_by_type(type:str,db:db_dependancy):
    try:
        if not type:
            raise HTTPException(status_code=400, detail="Type is required")
        boardings =db.query(models.Boarding).filter(models.Boarding.type == type).all()
        if not boardings:
                raise HTTPException(status_code=404, detail="No boardings found for this university")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.get("/boardings-price_range/{price_range}",response_model=List[BoardingBase],status_code=status.HTTP_200_OK)
async def get_boarding_by_price_range(price_range: str,db:db_dependancy):
    try:
        if not price_range:
            raise HTTPException(status_code=400, detail="Price Range is required")
        boardings =db.query(models.Boarding).filter(models.Boarding.price_range == price_range).all()
        if not boardings:
                raise HTTPException(status_code=404, detail="No boardings found for this university")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error") 
    
@app.get("/boardings-by-uni-type/{uni_id}/{type}", response_model=List[BoardingBase], status_code=status.HTTP_200_OK)
async def get_boardings_by_uni_and_type(uni_id: int, type: str, db: db_dependancy):
    try:
        if not uni_id or not type:
            raise HTTPException(status_code=400, detail="University ID and Type are required")
        boardings = db.query(models.Boarding).filter(
            models.Boarding.uni_id == uni_id, models.Boarding.type == type
        ).all()
        if not boardings:
            raise HTTPException(status_code=404, detail="No boardings found according to  the given criteria")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/boardings-by-type-price/{type}/{price_range}", response_model=List[BoardingBase], status_code=status.HTTP_200_OK)
async def get_boardings_by_type_and_price(type: str, price_range: str, db: db_dependancy):
    try:
        if not type or not price_range:
            raise HTTPException(status_code=400, detail="Type and Price Range are required")
        boardings = db.query(models.Boarding).filter(
            models.Boarding.type == type, models.Boarding.price_range == price_range
        ).all()
        if not boardings:
            raise HTTPException(status_code=404, detail="No boardings found according to the given criteria")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/boardings-by-uni-price/{uni_id}/{price_range}", response_model=List[BoardingBase], status_code=status.HTTP_200_OK)
async def get_boardings_by_uni_and_price(uni_id: int, price_range: str, db: db_dependancy):
    try:
        if not uni_id or not price_range:
            raise HTTPException(status_code=400, detail="University ID and Price Range are required")
        boardings = db.query(models.Boarding).filter(
            models.Boarding.uni_id == uni_id, models.Boarding.price_range == price_range
        ).all()
        if not boardings:
            raise HTTPException(status_code=404, detail="No boardings found according to  the given criteria")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/boardings-by-uni-price-type/{uni_id}/{price_range}/{type}", response_model=List[BoardingBase], status_code=status.HTTP_200_OK)
async def get_boardings_by_uni_price_and_type(uni_id: int, price_range: str, type: str, db: db_dependancy):
    try:
        if not uni_id or not price_range or not type:
            raise HTTPException(status_code=400, detail="University ID, Price Range, and Type are required")
        boardings = db.query(models.Boarding).filter(
            models.Boarding.uni_id == uni_id,
            models.Boarding.price_range == price_range,
            models.Boarding.type == type
        ).all()
        if not boardings:
            raise HTTPException(status_code=404, detail="No boardings found according to  the given criteria")
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/student-register/")
def register_user(user: UserBase, db: Session = Depends(get_db)):
    try:
        # Call the stored procedure
        query = text("CALL db_Create_Student(:username, :email, :password)")
        hashed_password = hash_password(user.password)
        db.execute(query, {
            "username": user.user_name,
            "email": user.email,
            "password": hashed_password
        })
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Student user profile registered successfully"}
