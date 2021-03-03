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
    //
    let res = await this.request(`auth/register`, data, "post");
    return res;
  }
  static async login(data) {
    //
    let res = await this.request(`auth/login`, data, "post");
    return res;
  }

  static async delete(username) {
    let res = await this.request(`auth/${username}`, {}, "delete");
    return res;
  }

  static async getProjects(userdetails) {
    //
    let res = await this.request(`projects/${userdetails.username}`, {});
    return res.data;
  }

  static async sendProjectDetails(data, userdetails) {
    //
    let res = await this.request(
      `projects/${userdetails.username}/projectCreate`,
      data,
      "post"
    );
    return res.data.results;
  }

  static async deleteProject({ id, currentUser }) {
    //
    await this.request(
      `projects/${currentUser.username}/project/${id}`,
      {},
      "delete"
    );
  }

  static async saveColumns({ proj_id, currentUser, data }) {
    //
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/columns`,
      { data },
      "post"
    );
    return res;
  }

  static async getColumns({ proj_id, currentUser }) {
    //
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/columns`,
      {}
    );
    return res.data;
  }

  static async saveCategoryName({ proj_id, currentUser, data }) {
    //
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/titleSave`,
      { data },
      "post"
    );
    return res.data;
  }

  static async saveStyleButtons({ proj_id, currentUser, styleData }) {
    //
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

  //Data ---> {question: "What's 2 + 2?", answer: "4", filters: [100,200,300]}
  static async saveQuesandAnswers({
    //
    proj_id,
    currentUser,
    formData,
    column_id,
  }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/${column_id}/getQuesandAnswers`,
      { formData },
      "post"
    );
    return res.data;
  }

  static async deleteQuesandAnswer({ proj_id, currentUser, id }) {
    await this.request(
      `projects/${currentUser.username}/project/${proj_id}/${id}/deleteQuesandAnswer`,
      {},
      "delete"
    );
  }

  static async getAllQuesandAnswers({ proj_id, currentUser }) {
    let res = await this.request(
      `projects/${currentUser.username}/project/${proj_id}/startProject`,
      {}
    );
    console.log(res);
    return res.data;
  }
}

export default JeopardyApi;
