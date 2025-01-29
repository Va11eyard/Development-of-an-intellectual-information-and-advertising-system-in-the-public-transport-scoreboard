from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.users import schemas, utils
from app.auth.utils import get_current_active_user

user_router = APIRouter()

@user_router.get("/", response_model=list[schemas.UserRead])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = utils.get_users(db, skip=skip, limit=limit)
    return users

@user_router.get("/{user_id}", response_model=schemas.UserRead)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = utils.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@user_router.put("/{user_id}", response_model=schemas.UserRead)
async def update_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.UserRead = Depends(get_current_active_user)
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db_user = utils.update_user(db, user_id, user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@user_router.delete("/{user_id}", response_model=schemas.UserRead)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserRead = Depends(get_current_active_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db_user = utils.delete_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

