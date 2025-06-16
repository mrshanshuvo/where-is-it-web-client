import React from "react";
import { Linkedin, Github, FileText } from "lucide-react";

const JobApplicationRow = ({ application, index }) => {
  const {
    applicant,
    linkedin,
    github,
    resume,
    company,
    title,
    company_logo,
  } = application;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="p-4 text-center text-sm text-gray-700 font-medium">{index + 1}</td>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={company_logo}
            alt={company}
            className="w-10 h-10 object-contain rounded-full shadow"
          />
          <div>
            <h4 className="text-base font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-gray-700">{applicant}</td>
      <td className="p-4 text-sm">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Linkedin size={18} /> LinkedIn
        </a>
      </td>
      <td className="p-4 text-sm">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-800 hover:underline"
        >
          <Github size={18} /> GitHub
        </a>
      </td>
      <td className="p-4 text-sm">
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-600 hover:underline"
        >
          <FileText size={18} /> Resume
        </a>
      </td>
    </tr>
  );
};

export default JobApplicationRow;
