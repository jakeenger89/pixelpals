from fastapi import APIRouter, Depends, HTTPException, Request
from queries.pixel import PixelArtQueries, PixelArtIn, PixelArtOut
from typing import List
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