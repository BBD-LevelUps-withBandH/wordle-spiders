--changeset karl:ddl:scores:fk_users
ALTER TABLE scores
ADD CONSTRAINT fk_users
FOREIGN KEY (user_id) REFERENCES users(user_id);
--rollback ALTER TABLE "scores" DROP CONSTRAINT fk_users

--changeset karl:ddl:scores:fk_users
ALTER TABLE scores
ADD CONSTRAINT fk_words
FOREIGN KEY (word_id) REFERENCES words(word_id);
--rollback ALTER TABLE "scores" DROP CONSTRAINT fk_users