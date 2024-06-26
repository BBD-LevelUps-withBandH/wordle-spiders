--changeset karl:ddl:createTable:users
CREATE TABLE users(
	user_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	user_email VARCHAR(50) NOT NULL UNIQUE
);
--rollback DROP TABLE "users";

--changeset karl:ddl:createTable:words
CREATE TABLE words(
	word_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	word CHAR(5) NOT NULL UNIQUE,
	played_date DATE NOT NULL DEFAULT CURRENT_DATE
);
--rollback DROP TABLE "words";


--changeset karl:ddl:createTable:scores
CREATE TABLE scores(
	score_id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	guesses_taken INT NOT NULL CHECK (guesses_taken >= 1 and guesses_taken <= 7),
	word_id INT NOT NULL,
	user_id INT NOT NULL,
	UNIQUE (word_id, user_id)
);
--rollback DROP TABLE "scores";