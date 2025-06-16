import React, { use } from "react";
import JobApplicationRow from "./JobApplicationRow";

const ApplicationList = ({ myApplicationsPromise }) => {
  const applications = use(myApplicationsPromise);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Jobs Applied So Far: <span className="text-blue-600">{applications.length}</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Job Info</th>
              <th className="p-4">Applicant</th>
              <th className="p-4">LinkedIn</th>
              <th className="p-4">GitHub</th>
              <th className="p-4">Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => (
              <JobApplicationRow
                application={application}
                index={index}
                key={application._id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;
