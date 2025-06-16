import React, { useEffect, useState } from 'react';
import JobsCard from '../Shared/JobsCard';

const HotJobs = ({ jobsPromise }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    jobsPromise.then(data => {
      setJobs(data);
    }).catch(err => {
      console.error("Failed to load jobs:", err);
    });
  }, [jobsPromise]);

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>🔥 Hot Jobs</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {jobs.map(job => (
          <JobsCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default HotJobs;
