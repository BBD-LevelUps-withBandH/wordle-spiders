--changeset karl:dml:mockData:scores
insert into scores (guesses_taken, word_id, user_id) values
(7, 1, 1),
(6, 5, 1),
(3, 7, 1),
(4, 13, 1),
(1, 1, 2),
(7, 7, 2),
(2, 9, 2),
(3, 2, 3),
(1, 3, 3),
(7, 8, 4),
(5, 12, 4);
--rollback DELETE FROM "scores";
