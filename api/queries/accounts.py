from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from queries.pool import pool
from fastapi import HTTPException


class DuplicateAccountError(ValueError):
    pass


class AccountIn(BaseModel):
    username: str
    email: str
    password: str


class AccountOut(BaseModel):
    account_id: int
    email: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class AccountOutWithPassword(AccountOut):
    hashed_password: str
    account_id: Optional[int]


class AccountUpdateIn(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None


class AccountUpdateOut(BaseModel):
    account_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None


class Follow(BaseModel):
    follower_id: int
    following_id: int


class AccountQueries:
    def login_account(self, email: str) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            account_id,
                            username,
                            email,
                            password
                        FROM account
                        WHERE email = %s
                        ORDER BY username
                        """,
                        [email],
                    )
                    record = db.fetchone()
                    if record:
                        account_out = AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[3],
                            hashed_password=record[3],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            password="",
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                password="",
                hashed_password="",
            )

    def get_account(self, account_id: int) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            account_id,
                            username,
                            email,
                            first_name,
                            last_name,
                            profile_picture_url,
                            banner_url,
                            password
                        FROM account
                        WHERE account_id = %s
                        ORDER BY username
                        """,
                        [account_id],
                    )
                    record = db.fetchone()
                    if record:
                        account_out = AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            first_name=record[3],
                            last_name=record[4],
                            profile_picture_url=record[5],
                            banner_url=record[6],
                            password=record[7],
                            hashed_password=record[7],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            first_name="",
                            last_name="",
                            profile_picture_url="",
                            banner_url="",
                            password="",
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                first_name="",
                last_name="",
                profile_picture_url="",
                banner_url="",
                password="",
                hashed_password="",
            )

    def get_accounts(self) -> List[AccountOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    records = db.execute(
                        """
                        SELECT
                            account_id,
                            email,
                            username,
                            first_name,
                            last_name,
                            profile_picture_url,
                            banner_url,
                            signup_date
                        FROM account
                        ORDER BY username
                        """
                    )
                    result = []
                    for record in records:
                        print("this is the record", record)
                        account_out = AccountOut(
                            account_id=int(record[0]),
                            email=record[1],
                            username=record[2],
                            first_name=record[3],
                            last_name=record[4],
                            profile_picture_url=record[5],
                            banner_url=record[6],
                            signup_date=record[7],
                        )
                        result.append(account_out)
                    return result
        except Exception:
            return {"message": "Could not get all users"}

    def create(
        self, info: AccountIn, hashed_password: str
    ) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    INSERT INTO account
                        (
                            username,
                            email,
                            password
                        )
                    VALUES
                        (%s, %s, %s)
                    RETURNING account_id, username, email, password
                    """,
                    [
                        info.username,
                        info.email,
                        hashed_password,
                    ],
                )
                record = db.fetchone()
                accountOut = AccountOutWithPassword(
                    account_id=record[0],
                    username=record[1],
                    email=record[2],
                    password=record[3],
                    hashed_password=hashed_password,
                )
                return accountOut

    def update_account(
        self, account_id: int, info: AccountUpdateIn
    ) -> AccountUpdateOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    db.execute(
                        """
                        UPDATE account
                        SET username = %s, first_name = %s, last_name = %s,
                            profile_picture_url = %s, banner_url = %s

                        WHERE account_id = %s
                        RETURNING account_id, username, email,
                        first_name, last_name, profile_picture_url,
                            banner_url
                        """,
                        [
                            info.username,
                            info.first_name,
                            info.last_name,
                            info.profile_picture_url,
                            info.banner_url,
                            account_id
                        ],
                    )
                    record = db.fetchone()
                    if record:
                        updated_account = AccountUpdateOut(
                            account_id=record[0],
                            username=record[1],
                            first_name=record[2],
                            last_name=record[3],
                            profile_picture_url=record[4],
                            banner_url=record[5]
                        )
                        return updated_account
                    else:
                        raise HTTPException(
                            status_code=404, detail="Account not found"
                        )
                except Exception as e:
                    raise HTTPException(status_code=500, detail=str(e))

    def delete_account(self, account_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM account
                        WHERE account_id = %s
                        """,
                        [account_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False
