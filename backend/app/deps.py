from fastapi import HTTPException, Depends
from sqlmodel import Session, select
from .models import User, Account, DSARRequest
from .database import get_session
from .auth import verify_token
from typing import List

# Get current user with database
async def get_current_user_db(
    user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
) -> User:
    user = session.exec(select(User).where(User.id == int(user_id))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get user account
async def get_user_account(
    user: User = Depends(get_current_user_db),
    session: Session = Depends(get_session)
) -> Account:
    account = session.exec(select(Account).where(Account.user_id == user.id)).first()
    if not account:
        # Create account if doesn't exist
        account = Account(user_id=user.id)
        session.add(account)
        session.commit()
        session.refresh(account)
    return account

# Get user DSAR requests
async def get_user_requests(
    user: User = Depends(get_current_user_db),
    session: Session = Depends(get_session)
) -> List[DSARRequest]:
    requests = session.exec(
        select(DSARRequest).where(DSARRequest.user_id == user.id)
    ).all()
    return requests
