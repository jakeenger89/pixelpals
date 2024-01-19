from fastapi import APIRouter, Depends, HTTPException, Request
from queries.pixel import PixelArtQueries, PixelArtIn, PixelArtOut, Like
from queries.accounts import AccountQueries
from routers.authenticator import authenticator
from typing import List, Dict
from pydantic import ValidationError
import json

router = APIRouter(tags=["pixel_art"])

@router.post("/api/pixel_art", response_model=PixelArtOut)
@router.options("/api/pixel_art")  # Add support for OPTIONS method
async def create_pixel_art(request: Request, pixel_art_data: PixelArtIn, queries: PixelArtQueries = Depends()):
    print('Request Body:', await request.body())

    # Skip validation for now
    return queries.create_pixel_art(pixel_art_data)

@router.get("/api/pixel_art", response_model=List[PixelArtOut])
def get_all_pixel_art(queries: PixelArtQueries = Depends()):
    return queries.get_all_pixel_art()

@router.get("/api/pixel_art/size/{size}", response_model=List[PixelArtOut])
def get_pixel_art_by_size(size: str, queries: PixelArtQueries = Depends()):
    return queries.get_pixel_art_by_size(size)

@router.get("/api/pixel_art/{art_id}", response_model=PixelArtOut)
def get_pixel_art_by_id(art_id: int, queries: PixelArtQueries = Depends()):
    return queries.get_pixel_art_by_id(art_id)

@router.delete("/api/pixel_art/{art_id}", response_model=dict)
def delete_pixel_art(art_id: int, queries: PixelArtQueries = Depends()):
    success = queries.delete_pixel_art(art_id)
    if success:
        return {"message": "Pixel art deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Pixel art not found")

@router.get("/api/likes", response_model=Dict[int, int])
def get_likes(queries: PixelArtQueries = Depends()):
    return queries.get_likes()

@router.get("/api/likes/check", response_model=dict)
def check_like_status(account_id: int, art_id: int, queries: PixelArtQueries = Depends()):
    return queries.check_like_status(account_id, art_id)


#like a pixel art
#auth required
@router.post("/api/art/{art_id}/like", response_model=bool)
def like_art(
    art_id: int,
    like: Like,
    queries: PixelArtQueries = Depends(),
):
    queries.like_art(art_id, like.account_id)
    return True


# Unlike art
@router.delete("/api/art/{art_id}/dislike", response_model=bool)
def unlike_art(
    art_id: int,
    like: Like,
    queries: PixelArtQueries = Depends(),
):
    queries.unlike_art(art_id, like.account_id)
    return True

# # get all liked art from an account
# # authentication required
# @router.get(
#     "/liked-art/{account_id}",
#     response_model=PixelArtOut,
#     operation_id="get_liked_art_by_account",
# )
# def get_liked_art_by_account(
#     account_id: int,
#     queries: PixelArtQueries = Depends(),
#     account_data: dict = Depends(authenticator.get_current_account_data),
# ):
#     if account_data:
#         try:
#             liked_art_response = (
#                 queries.get_liked_songs_by_account(account_id)
#             )

#             for art in liked_art_response["art"]:
#                 art["account_id"] = account_id
#                 art["username"] = account_data["username"]

#             return liked_art_response
#         except HTTPException as e:
#             # Handle specific exceptions if needed
#             raise e
#         except Exception as e:
#             print(f"Error in get_liked_art_by_account: {e}")
#             raise HTTPException(
#                 status_code=500, detail="Error retrieving liked art"
#             )
#     else:
#         raise HTTPException(status_code=401, detail="Not authenticated")