const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

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
    console.log(data);
    const result = await db.query(
      `INSERT INTO columns (column_id, column_name, project_id)
    values ${columns};`
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

  static async getColumns({ proj_id }) {
    const result = await db.query(
      `select projects.id, projects.num_answers, column_name from columns
       inner join projects on columns.project_id=projects.id where projects.id = $1`,
      [proj_id]
    );
    const columns = result.rows;
    if (columns.length) {
      const data = {
        columnLength: columns.length,
        questionLength: columns[0].num_answers,
      };

      return data;
    }
    return 0;
  }
}

module.exports = User;
