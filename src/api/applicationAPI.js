export const myApplicationsPromise = (email) => {
  return fetch(
    `https://whereisit-server-inky.vercel.app/applications?email=${email}`,
    {
      credentials: "include",
    }
  ).then((res) => res.json());
};
