--changeset karl:dml:mockData:words
insert into words (word, played_date) values
('WEBBY', '2024-05-01'),
('MITES', '2024-05-02'),
('FANGS', '2024-05-03'),
('TARSI', '2024-05-04'),
('WEAVE', '2024-05-05'),
('VENOM', '2024-05-06'),
('SCARY', '2024-05-07'),
('CRAWL', '2024-05-08'),
('TRAPS', '2024-05-09'),
('SNARE', '2024-05-09'),
('LURKS', '2024-05-10'),
('SPINS', '2024-05-10'),
('LARVA', '2024-05-10');
--rollback DELETE FROM "words";


    