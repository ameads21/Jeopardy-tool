const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");
const { connect } = require("../db");
const { text } = require("express");

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

    const column_ids = column_rows.rows.map((id) => {
      return `(${Object.values(id)}, ${proj_id})`;
    });
    const style_ids = await db.query(
      `INSERT INTO styles(column_id, project_id) VALUES ${column_ids} RETURNING id`
    );

    const buttonQuery = style_ids.rows.map((id) => {
      return `(${Object.values(id)})`;
    });
    const textQuery = style_ids.rows.map((id) => {
      return `(${Object.values(id)})`;
    });
    const quesandanswersQuery = style_ids.rows.map((id) => {
      return `(${Object.values(id)}, '[]', '[]', '[]')`;
    });

    await db.query(`INSERT INTO buttons (style_id) values ${buttonQuery}`);
    await db.query(`INSERT INTO text (style_id) values ${textQuery}`);
    await db.query(
      `INSERT INTO quesandanswers (style_id, questions, answers, filters) values ${quesandanswersQuery}`
    );
  }

  static async getColumns({ proj_id }) {
    const result = await db.query(
      `select projects.num_answers, columns.column_id, columns.column_name, buttons.text_color as button_text_color, buttons.background_color as button_background_color,
      buttons.padding as button_padding,
      text.text_color as text_text_color, text.background_color as text_background_color
      from projects inner join columns on columns.project_id = projects.id inner join styles on styles.column_id = columns.id inner join buttons on styles.id = buttons.style_id inner join
      text on styles.id = text.style_id where styles.project_id = $1 order by columns.column_id `,
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

  static async saveStyles({ proj_id, styleData }) {
    const { btnData, textData, id } = styleData;

    const style_id = await db.query(
      `select styles.id from styles inner join columns on columns.id = styles.column_id where
      columns.column_id = $1 and styles.project_id = $2`,
      [id, proj_id]
    );
    function clean(obj) {
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
      const btnResults = await db.query(
        `UPDATE buttons SET ${btnStyles.toString()} where style_id = $1`,
        [style_id.rows[0].id]
      );
    }

    if (textStyles.length > 0) {
      const textResults = await db.query(
        `UPDATE text SET ${textStyles.toString()} where style_id = $1`,
        [style_id.rows[0].id]
      );
    }

    return { success: true };
  }

  static async getQuesandAnswers({ proj_id, column_id }) {
    const style_id = await db.query(
      `select styles.id from styles inner join columns on columns.id = styles.column_id where
      columns.column_id = $1 and styles.project_id = $2`,
      [column_id, proj_id]
    );

    const quesandanswers = await db.query(
      `select questions, answers, filters from quesandanswers where style_id = $1`,
      [style_id.rows[0].id]
    );

    return {
      questions: quesandanswers.rows[0].questions,
      answers: quesandanswers.rows[0].answers,
      filters: quesandanswers.rows[0].filters,
    };
  }

  static async saveQuesandAnswers({ proj_id, data }) {
    const { column_id, dataCopy } = data;
    const questions = [];
    const answers = [];
    const filters = [];

    if (dataCopy.length) {
      dataCopy.map((q) => {
        questions.push(`"${q.question}"`);
        answers.push(`"${q.answer}"`);
        filters.push(`"[${q.filter.toString()}]"`);
      });
    }

    const stringQuestions = `[${questions.toString()}]`;
    const stringAnswers = `[${answers.toString()}]`;
    const stringFilters = `[${filters.toString()}]`;

    const style_id = await db.query(
      `select styles.id from styles inner join columns on columns.id = styles.column_id where
      columns.column_id = $1 and styles.project_id = $2`,
      [column_id, proj_id]
    );

    await db.query(
      `UPDATE quesandanswers SET questions = $1, answers = $2, filters = $3 where style_id = $4`,
      [stringQuestions, stringAnswers, stringFilters, style_id.rows[0].id]
    );
  }

  static async getProject({ proj_id }) {
    const results = await db.query(
      "select questions, answers, filters from quesandanswers inner join styles on styles.id = quesandanswers.style_id where project_id = $1",
      [proj_id]
    );

    async function clean(results, data = []) {
      if (
        results.rows[results.rows.length - 1].questions == "[]" ||
        results.rows[results.rows.length - 1].questions.length === 0
      ) {
        results.rows.pop();
      }
      if (results.rows.length === 0) {
        return data;
      }
      const rowLength = results.rows.length - 1;
      let questions;
      let answers;
      let filters;
      if (typeof results.rows[rowLength].questions === "string") {
        questions = JSON.parse(results.rows[rowLength].questions);
        answers = JSON.parse(results.rows[rowLength].answers);
        filters = JSON.parse(results.rows[rowLength].filters);
      } else {
        questions = results.rows[rowLength].questions;
        answers = results.rows[rowLength].answers;
        filters = results.rows[rowLength].filters;
      }
      if (!data[`column${rowLength + 1}`]) {
        data[`column${rowLength + 1}`] = [];
      }
      data[`column${rowLength + 1}`].push({
        question: questions.pop() || "No Question Found",
        answer: answers.pop() || "No Answer Found",
        filters: filters.pop() || "No Filters Found",
      });
      results.rows[rowLength].questions = questions;
      results.rows[rowLength].answers = answers;
      results.rows[rowLength].filters = filters;

      return clean(results, data);
    }

    const data = await clean(results);

    return { data };
  }
}

module.exports = User;
