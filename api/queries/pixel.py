from pydantic import BaseModel, ValidationError, validator
from typing import Optional, List
from datetime import datetime
from fastapi import HTTPException
from queries.pool import pool
import json


class PixelArtIn(BaseModel):
    account_id: int
    pixel_data: List[List[str]]  # Change the type to List[List[str]]
    name: str
    size: str  # '16x16', '32x32', '64x64'

    # Add a custom validator to check the size of pixel_data
    @validator("pixel_data", pre=True, allow_reuse=True)
    def check_pixel_data_size(cls, value):
        if len(value) == 0:
            raise ValueError("Pixel data should not be empty")
        rows = len(value)
        cols = len(value[0]) if rows > 0 else 0
        if any(len(row) != cols for row in value):
            raise ValueError("Invalid pixel data size (inconsistent number of columns)")
        return value


class PixelArtOut(BaseModel):
    art_id: int
    account_id: int
    pixel_data: List[List[str]]  # Use List[List[str]] to store color codes as strings
    name: str
    size: str
    creation_date: datetime


class PixelArtQueries:
    def create_pixel_art(self, pixel_art_data: PixelArtIn) -> PixelArtOut:
        print("Reached create_pixel_art method")
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    # ... (your existing code)

                    db.execute(
                        """
                        INSERT INTO pixel_art
                            (account_id, pixel_data, name, size)
                        VALUES
                            (%s, %s, %s, %s)
                        RETURNING art_id, account_id, pixel_data, name, size, creation_date
                        """,
                        [pixel_art_data.account_id,
                         pixel_art_data.pixel_data,
                         pixel_art_data.name,
                         pixel_art_data.size],
                    )
                    record = db.fetchone()

                    # Set creation_date separately
                    creation_date = record[5] if record and len(record) > 5 else datetime.utcnow()

                    pixel_art_out = PixelArtOut(
                        art_id=record[0],
                        account_id=record[1],
                        pixel_data=record[2],
                        name=record[3],
                        size=record[4],
                        creation_date=creation_date
                    )
                    return pixel_art_out
        except ValidationError as ve:
            print("Validation Error:", ve.json())
            raise HTTPException(status_code=422, detail="Validation Error")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Failed to create art")

    def get_all_pixel_art(self) -> List[PixelArtOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    try:
                        sql_query = """
                            SELECT
                                art_id, account_id, pixel_data, name, size, creation_date
                            FROM pixel_art
                            ORDER BY creation_date DESC
                        """
                        print(f"SQL Query: {sql_query}")

                        db.execute(sql_query)

                        query_result = db.fetchall()
                        result = []

                        for record in query_result:
                            print(f"Raw Record: {record}")

                            pixel_data_str = json.dumps(record[2])  # Convert the list to a JSON-formatted string
                            print(f"Pixel Data String: {pixel_data_str}")

                            pixel_data = json.loads(pixel_data_str) if pixel_data_str else []
                            print(f"Decoded Pixel Data: {pixel_data}")

                            pixel_art_out = PixelArtOut(
                                art_id=record[0],
                                account_id=record[1],
                                pixel_data=pixel_data,
                                name=record[3],
                                size=record[4],
                                creation_date=record[5]
                            )
                            result.append(pixel_art_out)

                        return result

                    except Exception as e:
                        # Print the exception details
                        print(f"Error in executing SQL query: {e}")
                        raise

        except Exception as e:
            # Print the exception message and traceback
            print(f"Error in get_all_pixel_art: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve all pixel art")

    def get_pixel_art_by_size(self, size: str) -> List[PixelArtOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            art_id, account_id, pixel_data, name, size, creation_date
                        FROM pixel_art
                        WHERE size = %s
                        ORDER BY creation_date DESC
                        """,
                        [size],
                    )
                    records = db.fetchall()
                    result = []
                    for record in records:
                        pixel_data_str = record[2]
                        pixel_data = json.loads(pixel_data_str) if pixel_data_str else []

                        pixel_art_out = PixelArtOut(
                            art_id=record[0],
                            account_id=record[1],
                            pixel_data=pixel_data,
                            name=record[3],
                            size=record[4],
                            creation_date=record[5]
                        )
                        result.append(pixel_art_out)
                    return result
        except Exception as e:
            print(f"Error in get_pixel_art_by_size: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve by size")


    def delete_pixel_art(self, art_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM pixel_art
                        WHERE art_id = %s
                        """,
                        [art_id],
                    )
                    return True
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Failed to delete")