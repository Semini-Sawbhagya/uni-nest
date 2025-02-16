import jwt
from datetime import datetime, timedelta
from jwt.exceptions import PyJWTError
from jose import JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from fastapi import Response, Request, status


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


SECRET_KEY = "uni_nest" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

#def get_current_user(token: str = Depends(oauth2_scheme)):
#   try:
#        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#        username: str = payload.get("sub")
#        if username is None:
#            raise HTTPException(status_code=401, detail="Invalid token")
#        return username
#    except PyJWTError:
#        raise HTTPException(status_code=401, detail="Invalid token")
    
def verify_token(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return username


def get_current_user(token: str = Depends(oauth2_scheme)):
    """ Decodes the JWT and returns the user data. """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_name = payload.get("sub")
        user_role = payload.get("role")
        user_id = payload.get("user_id")
        

        if not user_name or not user_role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return {"user_name": user_name, "user_role": user_role,"user_id": user_id}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
def roles_required(allowed_roles: list):
    def check_user_role(current_user: dict = Depends(get_current_user)):
        if current_user["user_role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )
        return current_user

    return check_user_role
