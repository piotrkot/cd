INSERT INTO users(id_i, user_s, passhash_s) VALUES (1, 'user', crypt('pass', gen_salt('bf')));

