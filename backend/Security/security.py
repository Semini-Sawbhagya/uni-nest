import jwt
from datetime import datetime, timedelta
from jwt.exceptions import PyJWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


SECRET_KEY = "uni_nest" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(access_token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

