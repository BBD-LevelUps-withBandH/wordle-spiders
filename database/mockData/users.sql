--changeset karl:dml:mockData:users
insert into users (user_email) values
('karl.etsebeth@bbd.co.za'),
('kayley.green@bbd.co.za'),
('samantha.vonstaden@bbd.co.za'),
('stefan.dejager@bbd.co.za');
--rollback DELETE FROM "users";