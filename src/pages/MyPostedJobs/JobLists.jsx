import React, { use } from "react";
import { Link } from "react-router";

const JobLists = ({ jobsCreatedByPromise }) => {
  const jobs = use(jobsCreatedByPromise);
  return (
    <div>
      <h2 className="text-3xl">Jobs Created by you: {jobs.length} </h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th></th>
              <th>Job Title</th>
              <th>Deadline</th>
              <th>Applications</th>
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {jobs.map((job, index) => (
              <tr key={job._id} className="text-center">
                <th>{index + 1} </th>
                <td>{job.title} </td>
                <td>{job.applicationDeadline} </td>
                <td>
                  <Link to={`/applications/${job._id}`} className="font-bold btn btn-info">View Applications</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobLists;
