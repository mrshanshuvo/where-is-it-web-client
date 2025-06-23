export const myApplicationsPromise = (email) => {
  return fetch(
    `https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/applications?email=${email}`,
    {
      credentials: "include",
    }
  ).then((res) => res.json());
};
