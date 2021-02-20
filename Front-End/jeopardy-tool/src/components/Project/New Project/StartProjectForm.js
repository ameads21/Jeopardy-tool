import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Api from "../../../Api";
import UserInfoContext from "../../../context/UserInfoContext";

function StartProjectForm() {
  const INITIAL_STATE = { proj_name: "", proj_description: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { currentUser } = useContext(UserInfoContext);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let data = { formData, currentUser };
      let { id } = await Api.sendProjectDetails(data, currentUser);
      history.push(`/${currentUser.username}/project/${id}`);
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  return (
    <div className="LoginForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="mb-3">Project Details</h3>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  name="proj_name"
                  className="form-control"
                  value={formData.proj_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>

                <textarea
                  type="proj_description"
                  name="proj_description"
                  className="form-control"
                  value={formData.proj_description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="btn btn-primary float-right"
                onSubmit={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartProjectForm;
