--changeset karl:view:see_high_scores runOnChange:true
CREATE OR REPLACE VIEW see_high_scores AS
SELECT user_id, min(guesses_taken)
FROM scores s
GROUP BY user_id
ORDER BY user_id
--rollback DROP VIEW "see_high_scores";