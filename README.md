# Cooper (The Coop's Discord Bot)
https://docs.google.com/document/d/1nmZARuG1FRNW4sibJU0k2BleP5KTcKurBa-Uul7lCf4/edit?usp=sharing

<!-- Access database -->
heroku pg:psql --app cooperchickenbot





<!-- Schema -->

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    item_code VARCHAR,
    quantity int,
    owner_id VARCHAR,
    CONSTRAINT fk_owner_id
        FOREIGN KEY(owner_id) 
        REFERENCES users(discord_id)
        ON DELETE CASCADE
);

CREATE TABLE structures(
    id SERIAL PRIMARY KEY,
    structure_code VARCHAR,
    health int,
    level int,
    owner_id VARCHAR,
    CONSTRAINT fk_owner_id
        FOREIGN KEY(owner_id) 
        REFERENCES users(discord_id)
        ON DELETE CASCADE
);

CREATE TABLE skills(
    id SERIAL PRIMARY KEY,
    crafting int,
    magic int,
    mining int,
    woodcutting int,
    fishing int,
    hunting int,
    player_id VARCHAR,
    CONSTRAINT fk_player_id
        FOREIGN KEY(player_id) 
        REFERENCES users(discord_id)
        ON DELETE CASCADE
);


CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    event_code VARCHAR UNIQUE NOT NULL,
    last_occurred bigint
);