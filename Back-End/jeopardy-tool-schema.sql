CREATE TABLE Users (
    id SERIAL NOT NULL,
    username TEXT   NOT NULL,
    password TEXT   NOT NULL,
    email TEXT   NOT NULL,
    CONSTRAINT pk_Users PRIMARY KEY (
        id
     ),
    CONSTRAINT uc_Users_username UNIQUE (
        username
    )
);

CREATE TABLE Projects (
    id SERIAL  NOT NULL,
    user_id int   NOT NULL,
    proj_name TEXT   NOT NULL,
    proj_description TEXT   NOT NULL,
    num_answers int DEFAULT 5,
    CONSTRAINT pk_Projects PRIMARY KEY (
        id
     )
);

CREATE TABLE Columns (
    id SERIAL  NOT NULL,
    column_id int   NOT NULL,
    column_name TEXT,
    project_id int   NOT NULL,
    CONSTRAINT pk_Columns PRIMARY KEY (
        id
     )
);

CREATE TABLE Buttons (
    id SERIAL  NOT NULL,
    column_id int   NOT NULL,
    text_color TEXT   DEFAULT 'text-light',
    background_color TEXT  DEFAULT 'btn-primary',
    padding TEXT DEFAULT 'p-3',
    CONSTRAINT pk_Buttons PRIMARY KEY (
        id
     )
);

CREATE TABLE Text (
    id SERIAL  NOT NULL,
    column_id int   NOT NULL,
    text_color TEXT   DEFAULT 'text-dark',
    background_color TEXT   DEFAULT 'bg-light',
    CONSTRAINT pk_Text PRIMARY KEY (
        id
     )
);

CREATE TABLE QuesAndAnswers (
    id SERIAL NOT NULL,
    column_id int   NOT NULL,
    question TEXT   NOT NULL,
    answer TEXT   NOT NULL,
    filters TEXT NOT NULL,
    CONSTRAINT pk_QuesAndAnswers PRIMARY KEY (
        id
     )
);

ALTER TABLE Projects ADD CONSTRAINT fk_Projects_user_id FOREIGN KEY(user_id)
REFERENCES Users (id) ON DELETE CASCADE;

ALTER TABLE Columns ADD CONSTRAINT fk_Columns_project_id FOREIGN KEY(project_id)
REFERENCES Projects (id) ON DELETE CASCADE;

ALTER TABLE Buttons ADD CONSTRAINT fk_Buttons_column_id FOREIGN KEY(column_id)
REFERENCES Columns (id) ON DELETE CASCADE;

ALTER TABLE Text ADD CONSTRAINT fk_Text_column_id FOREIGN KEY(column_id)
REFERENCES Columns (id) ON DELETE CASCADE;

ALTER TABLE QuesAndAnswers ADD CONSTRAINT fk_QuesAndAnswers_column_id FOREIGN KEY(column_id)
REFERENCES Columns (id) ON DELETE CASCADE;

