steps = [
    [
        """
        CREATE TABLE account (
            account_id SERIAL PRIMARY KEY NOT NULL,
            username VARCHAR(30) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            profile_picture_url VARCHAR(1000),
            banner_url VARCHAR(1000),
            signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        DROP TABLE IF EXISTS account;
        """
    ],
    [
        """
        CREATE TABLE pixel_art (
            art_id SERIAL PRIMARY KEY NOT NULL,
            account_id INTEGER REFERENCES account(account_id) ON DELETE CASCADE,
            pixel_data TEXT[][] NOT NULL,
            name TEXT NOT NULL,
            size VARCHAR(5) CHECK (size IN ('16x16', '32x32', '64x64')),
            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        DROP TABLE IF EXISTS pixel_art;
        """
    ],
    [
        """
        CREATE TABLE liked_art (
        account_id INTEGER REFERENCES account(account_id) ON DELETE CASCADE,
        art_id INTEGER REFERENCES pixel_art(art_id),
        PRIMARY KEY (account_id, art_id)
        );
        """,
        """
        DROP TABLE liked_art;
        """
    ],
]