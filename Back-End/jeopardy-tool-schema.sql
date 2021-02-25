-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

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

CREATE TABLE Styles (
    id SERIAL  NOT NULL,
    column_id int   NOT NULL,
    project_id int NOT NULL,
    CONSTRAINT pk_Styles PRIMARY KEY (
        id
     )
);

CREATE TABLE Buttons (
    id SERIAL  NOT NULL,
    style_id int   NOT NULL,
    text_color TEXT   DEFAULT 'text-light',
    background_color TEXT  DEFAULT 'btn-secondary',
    padding TEXT DEFAULT 'p-3',
    CONSTRAINT pk_Buttons PRIMARY KEY (
        id
     )
);

CREATE TABLE Text (
    id SERIAL  NOT NULL,
    style_id int   NOT NULL,
    text_color TEXT   DEFAULT 'text-dark',
    background_color TEXT   DEFAULT 'bg-light',
    CONSTRAINT pk_Text PRIMARY KEY (
        id
     )
);

CREATE TABLE QuesAndAnswers (
    id SERIAL NOT NULL,
    style_id int   NOT NULL,
    questions TEXT   NOT NULL,
    answers TEXT   NOT NULL,
    CONSTRAINT pk_QuesAndAnswers PRIMARY KEY (
        id
     )
);

ALTER TABLE Projects ADD CONSTRAINT fk_Projects_user_id FOREIGN KEY(user_id)
REFERENCES Users (id) ON DELETE CASCADE;

ALTER TABLE Columns ADD CONSTRAINT fk_Columns_project_id FOREIGN KEY(project_id)
REFERENCES Projects (id) ON DELETE CASCADE;

ALTER TABLE Styles ADD CONSTRAINT fk_Styles_column_id FOREIGN KEY(project_id)
REFERENCES Projects (id) ON DELETE CASCADE;

ALTER TABLE Buttons ADD CONSTRAINT fk_Buttons_style_id FOREIGN KEY(style_id)
REFERENCES Styles (id) ON DELETE CASCADE;

ALTER TABLE Text ADD CONSTRAINT fk_Text_style_id FOREIGN KEY(style_id)
REFERENCES Styles (id) ON DELETE CASCADE;

ALTER TABLE QuesAndAnswers ADD CONSTRAINT fk_QuesAndAnswers_style_id FOREIGN KEY(style_id)
REFERENCES Styles (id) ON DELETE CASCADE;

