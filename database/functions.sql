--changeset karl:function:calc_max_remaining_scores runOnChange:true
CREATE OR REPLACE FUNCTION calc_max_remaining_scores(
    client_id INT
)
RETURNS INT
AS $$
DECLARE
    num_words_of_day INT;
    user_scores_of_day INT;
BEGIN
	SELECT COUNT(*) INTO num_words_of_day
	FROM words
	WHERE played_date = CURRENT_DATE;
	
	SELECT COUNT(*) INTO user_scores_of_day
	FROM scores 
	INNER JOIN words ON scores.word_id = words.word_id
	WHERE user_email = client_id AND played_date = CURRENT_DATE;

    RETURN num_words_of_day-user_scores_of_day;
END;
$$
LANGUAGE plpgsql;
--rollback DROP FUNCTION "calc_max_remaining_scores";

--changeset sam:function:get_average_score_for_word runOnChange:true
CREATE OR REPLACE FUNCTION get_average_score_for_word(
	word_of_the_day TEXT
)
RETURNS NUMERIC AS
$$
DECLARE
    word_id_val INT;
    avg_score NUMERIC;
BEGIN
    -- Get the word_id for the word of the day
    SELECT word_id INTO word_id_val
    FROM words
    WHERE word = word_of_the_day;

    -- Calculate the average guesses taken for the word
    SELECT AVG(guesses_taken) INTO avg_score
    FROM scores
    WHERE word_id = word_id_val;

    -- Return the average score
    RETURN avg_score;
END;
$$
LANGUAGE plpgsql;
--rollback DROP FUNCTION "get_average_score_for_word";
