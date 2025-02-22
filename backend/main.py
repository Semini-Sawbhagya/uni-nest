from fastapi import FastAPI,Path,HTTPException,Depends,status
from pydantic import BaseModel
from typing import Annotated,List
import models
from models import User,Boarding,University,Payment,Notification,Package,Landlord,Student
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from Security.utils import hash_password, verify_password
from sqlalchemy.sql import text
from fastapi.middleware.cors import CORSMiddleware
from Security.security import create_access_token, get_current_user, verify_token,roles_required
from database import engine,get_db,Base
from fastapi.responses import RedirectResponse
from fastapi import Response,Request
from typing import Union


models.Base.metadata.create_all(bind=engine)
app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

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



# Pydantic models for request/response validation
class UniversityBase(BaseModel):
    uni_id: int
    name: str

class UserBase(BaseModel):
    user_name: str
    password: str
    email: str
    userType: str

class UserLogin(BaseModel):
    email: str
    password: str

class PaymentBase(BaseModel):
    payment_id: int
    amount: float
    date: str
    timestamp: str
    user_id: str

class StudentPayment(BaseModel):
    user_id: str
    amount: Union[int, float] 

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
    duration: int
    no_of_boardings: int
    name: str
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


@app.get("/universities", response_model=List[UniversityBase])
async def get_universities( db: db_dependancy):
    universities = db.query(models.University).all()
    if not universities:
        raise HTTPException(status_code=404, detail="No universities found")
    return universities

@app.get('/types', response_model=List[str])
async def get_types(db: db_dependancy):
    types = db.query(models.Boarding.type).distinct().all()
    types = [t[0] for t in types]  # Extract values from tuples
    
    if not types:
        raise HTTPException(status_code=404, detail="No types found")
    
    return types

@app.get('/price-ranges', response_model=List[str])
async def get_price_ranges(db: db_dependancy):
    price_ranges = db.query(models.Boarding.price_range).distinct().all()
    price_ranges = [p[0] for p in price_ranges]

    if not price_ranges:
        raise HTTPException(status_code=404, detail="No types found")
    return price_ranges


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
    
@app.get("/get_universities/{uni_id}/", response_model=List[BoardingBase], status_code=status.HTTP_200_OK)
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


@app.get("/get-landlord-details/{student_id}")
def get_landlord_details(student_id: str, db: Session = Depends(get_db)):
    try:
        # Call procedure with correct number of parameters
        query = text(
            "CALL find_landlord_details(:student_id, @landlord_id, @account_no, @name)"
        )
        db.execute(query, {"student_id": student_id})

        # Retrieve the stored procedure output values
        result = db.execute(text("SELECT @landlord_id, @account_no, @name")).fetchone()
        
        # Ensure results are valid
        if not result or result[0] is None:
            raise HTTPException(status_code=404, detail="Landlord not found")

        return {
            "landlord_user_id": result[0],
            "account_no": result[1],
            "name": result[2]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/student-payment/")
def make_payment(payment: StudentPayment, db: Session = Depends(get_db)):
    try:
        query = text("CALL Add_Student_Payment(:user_id, :amount)")
        db.execute(query, {
            "user_id": payment.user_id,
            "amount": payment.amount,
        })
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Payment made successfully"}



@app.post("/register")
def register_user(user: UserBase, db: Session = Depends(get_db)):
    try:
        # Call the stored procedure
        query = text("CALL db_Create_Account(:username, :email, :password, :userType)")
        hashed_password = hash_password(user.password)
        db.execute(query, {
            "username": user.user_name,
            "email": user.email,
            "password": hashed_password,
            "userType": user.userType
        })
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "User profile registered successfully"}


@app.post("/login/")
def login_user(user: UserLogin,response: Response ,db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    

    if db_user and verify_password(user.password, db_user.password):
        access_token = create_access_token({"sub": db_user.user_name,
                                            "role": db_user.role,
                                            "user_id": db_user.user_id})
        #response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="lax")
        user_id = db_user.user_id
        return {"message":"Login Success", "access_token": access_token, "token_type": "bearer","user_id": user_id,"role":db_user.role,"user_name":db_user.user_name}
    
#@app.get("/protected")
#def protected_route(current_user: str = Depends(get_current_user)):
#    return {"message": f"Hello, {current_user}!"}

#@app.get("/home")
#async def home(username: str = Depends(verify_token)):
#    return {"message": f"Welcome, {username}!"}

#@app.get("/student-home", dependencies=[Depends(roles_required("student"))])
#def student_home(current_user: dict = Depends(get_current_user)):
#    return {"message": f"Welcome, {current_user['user_name']}!", "role": "student"}



# an example of using the roles_required dependency
@app.get("/multi-role")
async def multi_role_route(current_user: dict = Depends(roles_required(["student", "admin"]))):
    print("Registering /multi-role route")
    return {"message": f"Welcome, {current_user['user_name']}! You have access to this multi-role route."}

@app.get("/student-home")
def student_home(current_user: dict = Depends(roles_required(["admin","student"]))):
    return {"message": f"Welcome, {current_user['user_name']}!", "role": "student"}

@app.get("/landlord_properties/{user_id}",response_model=List[BoardingBase],status_code=status.HTTP_200_OK)
async def get_boarding_by_user_ID(user_id: str,db:db_dependancy, current_user: dict = Depends(roles_required(["landlord"]))):
    try:
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        query = text("CALL db_get_Landlord_Boardings(:user_id)")
        result = db.execute(query, {"user_id": user_id}).fetchall()
        if not result:
                raise HTTPException(status_code=404, detail="No boardings found for this User")
        
        boardings = [
            BoardingBase(
                boarding_id=row.boarding_id,
                uni_id=row.uni_id,
                landlord_id=row.landlord_id,
                img=row.img,
                price_range=row.price_range,
                location=row.location,
                ratings=row.ratings,
                review=row.review,
                type=row.type,
                security=row.security,
                available_space=row.available_space
            )
            for row in result
        ]
        return boardings
    except Exception as e:
        print(f"Error fetching boardings: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.get('/packages',response_model=List[PackageBase],status_code=status.HTTP_200_OK)
async def get_packages(db:db_dependancy,current_user: dict = Depends(roles_required(["landlord"]))):
    try:
        packages = db.query(models.Package).all()
        if not packages:
            raise HTTPException(status_code=404, detail="No packages found")
        return packages
    except Exception as e:
        print(f"Error fetching packages: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")