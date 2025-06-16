import React from 'react';
import { GoLocation } from 'react-icons/go';
import { Link } from 'react-router';

const JobsCard = ({ job }) => {
  return (
    <div className="w-full md:w-[370px] h-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-4 p-5 bg-gray-50">
        <img
          src={
            job.company_logo ||
            'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          }
          alt={job.title}
          className="h-12 w-12 object-contain rounded-full border"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">
            {job.title || 'Untitled Job'}
          </h3>
          <span className="text-sm text-gray-500">{job.company || 'Unknown Company'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3 flex-1">
        <p className="text-sm text-gray-600 line-clamp-3">
          {job.description || 'No description available.'}
        </p>

        <div className="text-sm text-gray-700 leading-6 space-y-1">
          <p className="flex items-center gap-1">
            <GoLocation className="text-blue-500" />
            {job.location || 'Remote'}
          </p>
          <p>
            <strong>Salary:</strong>{' '}
            {job.salaryRange
              ? `${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency?.toUpperCase() || ''}`
              : 'Not specified'}
          </p>
          <p>
            <strong>Type:</strong> {job.jobType || 'N/A'}
          </p>
          <p>
            <strong>Deadline:</strong> {job.applicationDeadline || 'N/A'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {job.category && <span className="badge badge-outline">{job.category}</span>}
          {job.jobType && <span className="badge badge-outline">{job.jobType}</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <Link
          to={`/jobs/${job._id}`}
          className="w-full btn btn-outline btn-info btn-sm rounded-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobsCard;
