export const jobsCreatedByPromise = (email) => {
  return fetch(
    `https://whereisit-server-inky.vercel.app/jobs?email=${email}`
  ).then((res) => res.json());
};
