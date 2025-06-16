import React, { Suspense } from "react";
import useAuth from "../../hooks/useAuth";
import JobLists from "./JobLists";
import { jobsCreatedByPromise } from "../../api/jobsAPI";

const MyPostedJobs = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-4xl">My Posted Jobs: </h2>
      <Suspense>
        <JobLists jobsCreatedByPromise={jobsCreatedByPromise(user.email)}></JobLists>
      </Suspense>
    </div>
  );
};

export default MyPostedJobs;
