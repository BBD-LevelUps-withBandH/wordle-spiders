--changeset karl:view:see_high_scores runOnChange:true
CREATE OR REPLACE VIEW see_high_scores AS
SELECT user_email, min(guesses_taken)
FROM scores s
GROUP BY user_email
ORDER BY user_email
--rollback DROP VIEW "see_high_scores";