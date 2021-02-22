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

  static async saveColumns({ proj_id, currentUser, columnData }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/columns`,
      { columnData },
      "post"
    );
    return res;
  }

  static async getColumns({ proj_id, currentUser }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/columns`,
      {}
    );
    return res;
  }
}

export default JeopardyApi;
