import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class JeopardyApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_API_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JeopardyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return await axios({ url, method, data, params, headers });
    } catch (err) {
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async register(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res;
  }
  static async login(data) {
    let res = await this.request(`auth/login`, data, "post");
    return res;
  }

  static async getProjects(userdetails) {
    let res = await this.request(
      `projects/${userdetails.username}`,
      {},
      "post"
    );
    return res.data;
  }

  static async sendProjectDetails(data, userdetails) {
    let res = await this.request(
      `projects/${userdetails.username}/projectCreate`,
      data,
      "post"
    );
    return res.data.results;
  }

  static async deleteProject({ id, currentUser }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${id}`,
      {},
      "delete"
    );
    console.log(res);
  }

  static async saveColumns({ proj_id, currentUser, data }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/columns`,
      { data },
      "post"
    );
    return res;
  }

  static async getColumns({ proj_id, currentUser }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/columns`,
      {}
    );
    return res.data;
  }

  static async saveCategoryName({ proj_id, currentUser, data }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/titleSave`,
      { data },
      "post"
    );
    return res.data;
  }

  static async saveStyleButtons({ proj_id, currentUser, styleData }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/styleSave`,
      { styleData },
      "post"
    );
    return res.data;
  }

  static async getQuesandAnswers({ proj_id, currentUser, column_id }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/${column_id}/getQuesandAnswers`,
      { column_id }
    );
    return res.data;
  }

  static async saveQuesandAnswers({ proj_id, currentUser, data, column_id }) {
    console.log(data);
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/${column_id}/getQuesandAnswers`,
      { data },
      "post"
    );
    return res.data;
  }

  static async getAllQuesandAnswers({ proj_id, currentUser }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/startProject`,
      {}
    );
    return res.data.results;
  }
}

export default JeopardyApi;
