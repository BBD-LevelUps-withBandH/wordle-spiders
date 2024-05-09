--changeset karl:dml:mockData:words
insert into words (word, played_date) values
('WEBBY', '2024-05-09'),
('MITES', '2024-05-09'),
('FANGS', '2024-05-09'),
('TARSI', '2024-05-10'),
('WEAVE', '2024-05-10'),
('VENOM', '2024-05-10'),
('SCARY', '2024-05-10'),
('CRAWL', '2024-05-10'),
('TRAPS', '2024-05-10'),
('SNARE', '2024-05-10'),
('LURKS', '2024-05-10'),
('SPINS', '2024-05-10'),
('LARVA', '2024-05-10');
--rollback DELETE FROM "words";


    