const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");
const { connect } = require("../db");
const { text } = require("express");

class User {
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, email, id
        FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  static async register({ username, password, email }) {
    const duplicateCheck = await db.query(
      `SELECT username, id
         FROM users
         WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
         (username,
          password,
          email)
         VALUES ($1, $2, $3)
         RETURNING username, email, id`,
      [username, hashedPassword, email]
    );

    const user = result.rows[0];

    return user;
  }

  static async delete(username) {
    await db.query("DELETE FROM users WHERE username = $1", [username]);
  }

  static async projects(username) {
    const result = await db.query(
      `SELECT proj_name, proj_description, projects.id
        FROM projects LEFT JOIN users on 
        projects.user_id = users.id
        where users.username = $1`,
      [username]
    );

    const projects = result.rows;

    if (projects) {
      return projects;
    }
    throw new UnauthorizedError("No Projects Were Found!");
  }

  static async saveProject(proj_name, proj_description, user_id) {
    const result = await db.query(
      `insert into projects (user_id, proj_name, proj_description) 
      values ($1, $2, $3) returning id`,
      [user_id, proj_name, proj_description]
    );

    const projects = result.rows[0];

    if (projects) {
      return projects;
    }
    throw new UnauthorizedError("No Projects Were Found!");
  }

  static async deleteProject({ proj_id }) {
    const result = await db.query(`DELETE FROM projects WHERE id = $1`, [
      proj_id,
    ]);

    const projects = result.rows;

    if (projects) {
      return projects;
    }
    throw new UnauthorizedError("No Projects Were Found!");
  }

  static async saveColumns({ data, proj_id }) {
    const { columns, questionCount } = data;
    const result = await db.query(
      `INSERT INTO columns (column_id, column_name, project_id)
    values ${columns} RETURNING id;`
    );

    await db.query(`UPDATE projects SET num_answers = $1 where id = $2`, [
      questionCount,
      proj_id,
    ]);

    const projects = result.rows;
    if (projects) {
      return projects;
    }
    throw new UnauthorizedError("Hmm, that wasn't supposed to happen.");
  }

  static async createStyles({ proj_id }) {
    const column_rows = await db.query(
      `SELECT id FROM columns where project_id = $1`,
      [proj_id]
    );

    const buttonQuery = column_rows.rows.map((id) => {
      return `(${Object.values(id)})`;
    });
    const textQuery = column_rows.rows.map((id) => {
      return `(${Object.values(id)})`;
    });

    await db.query(`INSERT INTO buttons (column_id) values ${buttonQuery}`);
    await db.query(`INSERT INTO text (column_id) values ${textQuery}`);
  }

  static async getColumns({ proj_id }) {
    const result = await db.query(
      `select projects.num_answers, columns.column_id, columns.column_name, buttons.text_color as button_text_color, buttons.background_color as button_background_color,
      buttons.padding as button_padding,
      text.text_color as text_text_color, text.background_color as text_background_color
      from projects inner join columns on columns.project_id = projects.id inner join buttons on columns.id = buttons.column_id inner join
      text on columns.id = text.column_id where columns.project_id = $1 order by columns.column_id `,
      [proj_id]
    );

    const columns = result.rows;
    const names = columns.map((name) => {
      return name.column_name;
    });

    function clean(obj) {
      const styles = { buttons: [], text: [] };
      for (let prop in obj) {
        if (
          obj[prop] === null ||
          obj[prop] === undefined ||
          obj[prop] === "" ||
          obj.TEXTinnerText
        ) {
          delete obj[prop];
        }
      }
      Object.entries(obj).map(([key, value]) => {
        if (key.includes("button_")) {
          styles.buttons.push(value);
        } else {
          styles.text.push(value);
        }
      });
      return styles;
    }

    const styles = columns.map(
      ({ num_answers, column_id, column_name, ...style }) => {
        return clean(style);
      }
    );

    if (columns.length) {
      const data = {
        columnLength: columns.length,
        questionLength: columns[0].num_answers,
        columnName: names,
        columnStyles: styles,
      };

      return data;
    }
    return 0;
  }

  static async saveColumnTitle({ proj_id, data }) {
    const { title, id } = data;
    const result = await db.query(
      `UPDATE columns SET column_name = $1 where project_id = $2 AND column_id = $3`,
      [title, proj_id, id]
    );

    return result.rows;
  }

  static async saveStyles({ styleData, proj_id }) {
    const { btnData, textData, id } = styleData;
    delete textData["TEXTinnerText"];
    const column_id = await db.query(
      "SELECT id FROM columns where column_id = $1 and project_id = $2",
      [id, proj_id]
    );
    function clean(obj) {
      for (let prop in obj) {
        if (
          obj[prop] === null ||
          obj[prop] === undefined ||
          obj[prop].length === 0
        ) {
          delete obj[prop];
        }
      }
      return Object.entries(obj).map(([key, value]) => {
        if (key.includes("BTN")) {
          return `${key.replace("BTN", "")} = '${value}'`;
        } else {
          return `${key.replace("TEXT", "")} = '${value}'`;
        }
      });
    }

    const btnStyles = clean(btnData);
    const textStyles = clean(textData);

    if (btnStyles.length > 0) {
      await db.query(
        `UPDATE buttons SET ${btnStyles.toString()} where column_id = $1`,
        [column_id.rows[0].id]
      );
    }

    if (textStyles.length > 0) {
      await db.query(
        `UPDATE text SET ${textStyles.toString()} where column_id = $1`,
        [column_id.rows[0].id]
      );
    }

    return { success: true };
  }

  static async getQuesandAnswers({ column_id, proj_id }) {
    const column = await db.query(
      `select id from columns where column_id = $1 and project_id = $2`,
      [column_id, proj_id]
    );
    const quesandanswers = await db.query(
      `select id, question, answer, filters from quesandanswers where column_id = $1`,
      [column.rows[0].id]
    );

    const results = quesandanswers.rows;
    return results;
  }

  static async saveQuesandAnswers({ formData, proj_id, column_id }) {
    const col_id = await db.query(
      "SELECT id FROM columns where project_id = $1 and column_id = $2",
      [proj_id, column_id]
    );

    const results = await db.query(
      `INSERT INTO quesandanswers (column_id, question, answer, filters)  VALUES ($1, $2, $3, $4) returning id, question, answer, filters`,
      [
        col_id.rows[0].id,
        formData.question,
        formData.answer,
        `[${formData.filters}]`,
      ]
    );
    return results.rows[0];
  }

  static async deleteQuesandAnswer({ quesId }) {
    await db.query("DELETE FROM quesandanswers where id = $1", [quesId]);
  }

  static async getProject({ proj_id }) {
    const results = await db.query(
      "select columns.column_id, question, answer, filters from quesandanswers inner join columns on columns.id = quesandanswers.column_id where project_id = $1 order by columns.column_id",
      [proj_id]
    );

    const data = [];
    results.rows.map((i) => {
      if (data[`Column ${i.column_id}`]) {
        data[`Column ${i.column_id}`].push(i);
      } else {
        data[`Column ${i.column_id}`] = [];
        data[`Column ${i.column_id}`].push(i);
      }
    });
    return { data };
  }
}

module.exports = User;
