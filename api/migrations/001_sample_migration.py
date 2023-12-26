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
]