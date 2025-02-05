from sqlalchemy import Column, String, Integer, DECIMAL, Date, DateTime, Boolean, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
from database import Base
Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class University(Base):
    __tablename__ = "university"

    uni_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    boardings = relationship("Boarding", back_populates="university")

class User(Base):
    __tablename__ = "user"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_name = Column(String(20), nullable=False)
    password = Column(String(20), nullable=False)
    email = Column(String(20), nullable=False)
    role = Column(Enum('student', 'landlord', 'admin'), nullable=False)
    payments = relationship("Payment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    landlord = relationship("Landlord", back_populates="user", uselist=False)
    student = relationship("Student", back_populates="user", uselist=False)

class Payment(Base):
    __tablename__ = "payment"

    payment_id = Column(Integer, primary_key=True)
    amount = Column(DECIMAL(15,2), nullable=False)
    date = Column(Date, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    user_id = Column(String(36), ForeignKey("user.user_id"), nullable=False)
    user = relationship("User", back_populates="payments")

class Notification(Base):
    __tablename__ = "notification"

    notification_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("user.user_id"), nullable=False)
    date = Column(Date, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    message = Column(String(255), nullable=False)
    status = Column(Boolean, nullable=False)
    user = relationship("User", back_populates="notifications")

class Package(Base):
    __tablename__ = "package"

    package_id = Column(String(36), primary_key=True, default=generate_uuid)
    amount = Column(DECIMAL(15,2), nullable=False)
    duration = Column(Date, nullable=False)
    no_of_boardings = Column(Integer, nullable=False)
    landlords = relationship("Landlord", back_populates="package")

class Landlord(Base):
    __tablename__ = "landlord"

    landlord_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), nullable=False)
    contact = Column(Integer, nullable=False)
    profile_pic = Column(String(50))
    account_no = Column(String(20), nullable=False)
    address = Column(String(255), nullable=False)
    package_id = Column(String(36), ForeignKey("package.package_id"))
    user_id = Column(String(36), ForeignKey("user.user_id"), nullable=False)
    package = relationship("Package", back_populates="landlords")
    user = relationship("User", back_populates="landlord")
    boardings = relationship("Boarding", back_populates="landlord")

class Boarding(Base):
    __tablename__ = "boarding"

    boarding_id = Column(String(36), primary_key=True, default=generate_uuid)
    uni_id = Column(Integer, ForeignKey("university.uni_id"), nullable=False)
    landlord_id = Column(String(36), ForeignKey("landlord.landlord_id"), nullable=False)
    img = Column(Text)
    price_range = Column(Enum("Rs: 3000-5000", "Rs: 5000-20000", "other"), nullable=False)
    location = Column(String(255), nullable=False)
    ratings = Column(DECIMAL(3,2))
    review = Column(Text)
    type = Column(Enum("Room", "house", "apartment"), nullable=False)
    security = Column(Text)
    available_space = Column(Integer, nullable=False)
    university = relationship("University", back_populates="boardings")
    landlord = relationship("Landlord", back_populates="boardings")
    students = relationship("Student", back_populates="boarding")

class Student(Base):
    __tablename__ = "student"

    student_id = Column(String(36), primary_key=True, default=generate_uuid)
    boarding_id = Column(String(36), ForeignKey("boarding.boarding_id"))
    account_no = Column(String(20), nullable=False)
    contact = Column(Integer, nullable=False)
    address = Column(String(50), nullable=False)
    profile_pic = Column(String(50))
    user_id = Column(String(36), ForeignKey("user.user_id"), nullable=False)
    boarding = relationship("Boarding", back_populates="students")
    user = relationship("User", back_populates="student")
