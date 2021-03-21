import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../../helpers/Alert";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";

function Register() {
  const { register } = useContext(AuthContext);
  const history = useHistory();
  const INITIAL_STATE = { username: "", password: "", email: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let results = await register(formData);
    setIsLoading(false);
    if (results.success) {
      history.push(`/${formData["username"]}/projects`);
    } else {
      setFormErrors(results.errors);
    }
  }

  return (
    <div className=" hero" style={{ backgroundImage: "/HomeBackground.jpg" }}>
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="mb-3" style={{ color: "white" }}>
          Register
        </h3>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {formErrors.length ? (
                <Alert type="danger" messages={formErrors} />
              ) : null}
              {!isLoading ? (
                <button
                  className="btn btn-primary float-right"
                  onSubmit={handleSubmit}
                >
                  Submit
                </button>
              ) : (
                <LoadingSpinner />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
