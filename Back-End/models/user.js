const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");
const { connect } = require("../db");

class User {
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, id
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
    console.log(proj_name, proj_description, user_id);
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
    console.log(result);

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

    const column_ids = column_rows.rows.map((id) => {
      return `(${Object.values(id)}, ${proj_id})`;
    });
    const style_ids = await db.query(
      `INSERT INTO styles(column_id, project_id) VALUES ${column_ids} RETURNING id`
    );

    const buttonQuery = style_ids.rows.map((id) => {
      return `(${Object.values(id)}, '', 'btn-secondary')`;
    });
    const textQuery = style_ids.rows.map((id) => {
      return `(${Object.values(id)}, '', '', '')`;
    });
    const quesandanswersQuery = style_ids.rows.map((id) => {
      return `(${Object.values(id)}, '[]', '[]')`;
    });

    await db.query(
      `INSERT INTO buttons (style_id, text_color, background_color) values ${buttonQuery}`
    );
    await db.query(
      `INSERT INTO text (style_id, text_input, text_color, background_color) values ${textQuery}`
    );
    await db.query(
      `INSERT INTO quesandanswers (style_id, questions, answers) values ${quesandanswersQuery}`
    );
  }

  static async getColumns({ proj_id }) {
    const result = await db.query(
      `select projects.id, projects.num_answers, column_name from columns
       inner join projects on columns.project_id=projects.id where projects.id = $1 order by columns.column_id`,
      [proj_id]
    );
    const columns = result.rows;
    const names = columns.map((name) => {
      return name.column_name;
    });
    if (columns.length) {
      const data = {
        columnLength: columns.length,
        questionLength: columns[0].num_answers,
        columnName: names,
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

  static async saveStyles({ proj_id, styleData }) {
    const { btnData, textData, id } = styleData;
    const style_id = await db.query(
      `select styles.id from styles inner join columns on columns.id = styles.column_id where
      columns.column_id = $1 and styles.project_id = $2`,
      [id, proj_id]
    );
    function clean(obj) {
      for (let prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
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

    const btnResults = await db.query(
      `UPDATE buttons SET ${btnStyles.toString()} where style_id = $1`,
      [style_id.rows[0].id]
    );

    const textResults = await db.query(
      `UPDATE text SET ${textStyles.toString()} where style_id = $1`,
      [style_id.rows[0].id]
    );

    return { success: true };
  }
}

module.exports = User;
