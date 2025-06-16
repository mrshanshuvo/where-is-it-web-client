import React from "react";
import { Link, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";

const JobApply = () => {
  const { id: jobId } = useParams();
  const { user } = useAuth();
  console.log(jobId, user);

  const handleApplyForm = e => {
    e.preventDefault()
    const form = e.target
    const linkedin = form.linkedin.value
    const github = form.github.value
    const resume = form.resume.value

    console.log(linkedin, github, resume);

    const application = {
      jobId,
      applicant: user.email,
      linkedin,
      github,
      resume
    }
    axios.post('http://localhost:5000/applications', application)
      .then(res => {
        console.log(res.data);
        if (res.data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div>
      <h3 className="text-4xl my-6">Apply for this job: <Link to={`/jobs/${jobId}`} className="btn btn-info">Details</Link></h3>
      <form onSubmit={handleApplyForm}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <label className="label">LinkedIn URL</label>
          <input type="url" name="linkedin" className="input" placeholder="LinkedIn Profile URL" />

          <label className="label">GitHub URL</label>
          <input type="url" name="github" className="input" placeholder="GitHub Profile URL" />

          <label className="label">Resume URL</label>
          <input type="url" name="resume" className="input" placeholder="Resume URL" />

          <input type="submit" value="Apply" className="btn" />
        </fieldset>
      </form>
    </div>
  );
};

export default JobApply;
