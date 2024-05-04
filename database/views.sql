--changeset karl:view:seeHighScores runOnChange:true
CREATE OR REPLACE VIEW seeHighScores AS
SELECT user_id, min(guesses_taken)
FROM scores s
GROUP BY user_id
ORDER BY user_id
--rollback DROP VIEW "seeHighScores";