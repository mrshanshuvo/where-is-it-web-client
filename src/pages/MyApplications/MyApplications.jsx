import React, { Suspense } from "react";
import ApplicationState from "./ApplicationState";
import ApplicationList from "./ApplicationList";
import useAuth from "../../hooks/useAuth";
import { myApplicationsPromise } from "../../api/applicationAPI";



const MyApplications = () => {
  const { user } = useAuth();

  return (
    <div>
      <ApplicationState></ApplicationState>
      <Suspense fallback={"loading your applications"}>
        <ApplicationList
          myApplicationsPromise={myApplicationsPromise(user.email)}
        ></ApplicationList>
      </Suspense>
    </div>
  );
};

export default MyApplications;
