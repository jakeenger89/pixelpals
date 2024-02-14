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

1/17/2024-1/18/2024:
    the 17th i wanted to import my likes function which included total likes. we created a table which includes account_id and art_id int references to the other tables. from there added my like and dislike function to queries from the previous mistmusic project and its routers. this time i created two separate functions one to check and tally up the likes for each art_id so per art_id and how ever many account_id's associrate it we render total likes. and another check to input system account_id example and art_id example if return true we render an unlike button if false we render a like button (false meaning not in databaes so user hasnt liked iamge).
    a few other things was a heavy modification to pixelartgallery.js i removed the name render, and the total like in favor for the dynamically rendered like button, i was having thousands of GET calls for the username and was bogging down my pc, as well some issue when fetching pixelArt data, i wanted to dynamically render the button like mentioned above but when i would ad pixelArt to the fetchdata return it would bog everything down. so reformated to render how i wanted, with a perticular ammount of images per page to help with loading.
    We were going to remove 32x32 and 64x64 because last night i was thinking maybe hte issue is just too much information in the database, but when in reality its hte constant fetching and rendering of the information thats running the cpu down

2/14/2024:
    havnt worked on this in a while, created a new router/ function to fetch all the created art based on the logged in users account_id. so now when the logged in user goes to their profile they hava nav link to view all their created art in the same view as pixelartgallery. and from there we can navigate to the actual art page. some other minor fixes were to always navigate the user back to their list of art upon deletion of said art. and incorporating the like / dislike button on that individual page view just so make the user experience better