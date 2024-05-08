--changeset karl:procedure:add_score runOnChange:true
CREATE OR REPLACE PROCEDURE add_score(
    IN user_email_in VARCHAR(50),
    IN word_in CHAR(5),
    IN guesses_taken_in INT
)
AS $$
DECLARE
    user_id_in INT;
	word_id_in INT;
BEGIN
	SELECT user_id INTO user_id_in
	FROM users
	WHERE user_email = user_email_in;
	
	SELECT word_id INTO word_id_in
	FROM words
	WHERE word = word_in;

    INSERT INTO scores (guesses_taken, word_id, user_id) 
	VALUES (guesses_taken_in, word_id_in, user_id_in);
END;
$$
LANGUAGE plpgsql;
--rollback DROP PROCEDURE "add_score";