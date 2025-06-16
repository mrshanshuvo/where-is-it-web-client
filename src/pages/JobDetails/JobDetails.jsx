import React from 'react';
import { Link, useLoaderData } from 'react-router';
import {
  GoLocation,
} from 'react-icons/go';
import {
  MdWork,
  MdCategory,
  MdAttachMoney,
  MdEvent,
  MdOutlineAssignmentTurnedIn,
} from 'react-icons/md';

const JobDetails = () => {
  const job = useLoaderData();

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 bg-white rounded-xl shadow-md space-y-8">
      {/* Job Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={job.company_logo || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'}
          alt={job.company}
          className="h-16 w-16 rounded-full border object-contain"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title || 'Job Title'}</h1>
          <p className="text-sm text-gray-500 mt-1">{job.company || 'Unknown Company'}</p>
        </div>
      </div>

      {/* Job Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        <InfoItem icon={<GoLocation className="text-blue-600" />} label="Location" value={job.location} />
        <InfoItem icon={<MdWork className="text-green-600" />} label="Job Type" value={job.jobType} />
        <InfoItem icon={<MdCategory className="text-purple-600" />} label="Category" value={job.category} />
        <InfoItem
          icon={<MdAttachMoney className="text-yellow-600" />}
          label="Salary"
          value={
            job.salaryRange
              ? `${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency?.toUpperCase() || ''}`
              : 'Not specified'
          }
        />
        <InfoItem icon={<MdEvent className="text-red-600" />} label="Deadline" value={job.applicationDeadline} />
        <InfoItem icon={<MdOutlineAssignmentTurnedIn className="text-indigo-600" />} label="Status" value={job.status} />
      </div>

      {/* Description */}
      {job.description && (
        <Section title="Job Description">
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </Section>
      )}

      {/* Responsibilities */}
      {job.responsibilities?.length > 0 && (
        <Section title="Responsibilities">
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {job.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Requirements */}
      {job.requirements?.length > 0 && (
        <Section title="Requirements">
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {job.requirements.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* HR Contact */}
      <div className="text-gray-700 text-sm italic">
        <p>
          <span className="font-semibold">Contact HR:</span> {job.hr_name || 'HR Name'} (
          <a
            href={`mailto:${job.hr_email || ''}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {job.hr_email || 'hr@example.com'}
          </a>
          )
        </p>
      </div>

      {/* Apply Button */}
      <div className="flex justify-center pt-4">
        <Link to={`/jobApply/${job._id}`}>
          <button className="btn btn-primary btn-lg w-full sm:w-auto transition hover:scale-105 duration-300">
            Apply Now
          </button>
        </Link>
      </div>
    </div>
  );
};

// Section Wrapper
const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">{title}</h2>
    {children}
  </section>
);

// Info Field
const InfoItem = ({ icon, label, value }) => (
  <p className="flex items-start gap-2">
    {icon}
    <span>
      <strong>{label}:</strong> {value || 'N/A'}
    </span>
  </p>
);

export default JobDetails;
