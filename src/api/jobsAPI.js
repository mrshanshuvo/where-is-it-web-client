export const jobsCreatedByPromise = (email) => {
  return fetch(
    `https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/jobs?email=${email}`
  ).then((res) => res.json());
};
