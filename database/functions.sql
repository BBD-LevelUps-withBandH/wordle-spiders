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
	WHERE user_id = client_id AND played_date = CURRENT_DATE;

    RETURN num_words_of_day-user_scores_of_day;
END;
$$
LANGUAGE plpgsql;
--rollback DROP FUNCTION "calc_max_remaining_scores";