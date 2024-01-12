import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';

import './CreatePixelArt.css';

const CreatePixelArt = () => {
  const createEmptyGrid = (rows, cols) => {
    return Array.from({ length: rows }, () => Array(cols).fill('#FFFFFF'));
  };

  const [name, setName] = useState('');
  const [size, setSize] = useState('16x16');
  const [grid, setGrid] = useState(createEmptyGrid(16, 16));
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [drawing, setDrawing] = useState(false);
  const [lastClickedSquare, setLastClickedSquare] = useState(null);

  useEffect(() => {
    const [rows, cols] = size.split('x').map(Number);
    setGrid(createEmptyGrid(rows, cols));
  }, [size]);

  const handleColorChange = (row, col) => {
    if (drawing) {
      const newGrid = grid.map(row => row.slice()); // Create a new copy of the grid
      newGrid[row][col] = selectedColor;
      setGrid(newGrid);
    }
  };

  const handleMouseDown = (row, col) => {
    setDrawing(true);
    setLastClickedSquare({ row, col });
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setLastClickedSquare(null);
  };

  const handlePixelClick = (row, col) => {
    const newGrid = grid.map(row => row.slice()); // Create a new copy of the grid
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
    setLastClickedSquare({ row, col });
  };

  const getUserId = () => {
    const token = localStorage.getItem('yourAuthToken');

    if (token) {
      try {
        // Decode the JWT token
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

        // Assuming the decoded token structure includes the account_id
        const account_id = decodedToken.account?.account_id;
        if (account_id) {
          return account_id;
        } else {
          console.error('Account ID not found in decoded token:', decodedToken);
          return null;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }

    return null;
  };

  const handleCreatePixelArt = async () => {
    try {
      const account_id = getUserId();
      console.log('Account ID:', account_id);

      // Convert the grid into a format suitable for the server
      const formattedPixelData = grid.map(row => row.map(color => color));

      console.log('Formatted Pixel Data:', formattedPixelData);
      console.log('Request Payload:', JSON.stringify({
        account_id,
        pixel_data: formattedPixelData,
        name,
        size,
      }));

      const response = await fetch('http://localhost:8000/api/pixel_art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id,
          pixel_data: formattedPixelData,
          name,
          size,
        }),
      });

      console.log('Server Response:', response);

      if (!response.ok) {
        const data = await response.json();
        console.error('Error details:', data); // Log the entire error object
        alert(`Error: ${response.status} - ${response.statusText}`);
      } else {
        alert('Pixel art created successfully!');
      }
    } catch (error) {
      console.error('Error creating pixel art:', error);
    }
  };

  return (
    <div>
      <h1>Create Pixel Art</h1>

      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />

      <label htmlFor="size">Size:</label>
      <select
        id="size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        required
      >
        <option value="16x16">16x16</option>
        <option value="32x32">32x32</option>
        <option value="64x64">64x64</option>
      </select>
      <br />

      {/* Color Picker */}
      <label htmlFor="color">Color:</label>
      <ChromePicker
        color={selectedColor}
        onChange={(color) => setSelectedColor(color.hex)}
      />
      <br />

      <div
        className="pixel-grid"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="pixel-row">
            {row.map((color, colIndex) => (
              <div
                key={colIndex}
                className="pixels"
                style={{ backgroundColor: color }}
                onMouseEnter={() => handleColorChange(rowIndex, colIndex)}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={handleCreatePixelArt}>Create Pixel Art</button>
    </div>
  );
};

export default CreatePixelArt;