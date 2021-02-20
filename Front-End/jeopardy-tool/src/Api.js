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

  static async getProjects(username) {
    let res = await this.request(`projects/${username}`, {}, "post");
    return res.data;
  }
}

export default JeopardyApi;
