12/26/2023:

    imported all the basic login functionallity from a previous project, FastAPI backend working with beekeeper, currently can create authorized accounts, threw in the login page, and the react app is working along with fast api. just wanted to start on this project with the basics today.

1/2/2024:
    imported the rest of the signup page, login page, and basic account page, finished those routes on app.js and installed the necessary packages. you can login signup and get directed to your account page on the front end React app

1/9/2024:
    today i fleshed out saving pixel_data into the database, we have a 2d list list of strings saved to the database. From there i implemented a get all art, based on the selected size on the front end. the working one right now is 16x16 any other display cuts it and frams it as if it was 16x unlimited which ill get to imlpementing later. but we have a way to save and store the color data and re render it back on the front end, with any color style hex,rgba,hsla etc.

1/11/2024:
    today i created a individal view page for each art render the 16,32, and 64, they render respectivly to their size now, when before for example 32 would be rendered hte same as 16 due to the css. so we incorporated checks to check on the size and it will get rendered with a custom css depending on the pixel size. As well added a hover effect on the individual art page so users can see what color values were used per square. Lastly fleshed out the delete function just on PixelArt.js

1/15/2024:
    today we utilized my old table for likes on some form of content, what i did was add table, functions, routers, async function on hte js page to handle the ability for useres to like/unlike pixel art which gets saved in the db, and can be re rendered later to keep track of all user's liked art, all the likes on a certain art, looking up art based on "popularity" likes etc.