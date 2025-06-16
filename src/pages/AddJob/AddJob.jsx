import React, { use } from 'react';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddJob = () => {
  const { user } = use(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Extract and organize salary-related fields
    const { minSalary, maxSalary, currency, requirements, responsibilities, ...rest } = data;
    const newJob = {
      ...rest,
      salaryRange: { minSalary, maxSalary, currency },
      status: "active",
      requirements: requirements.split(',').map(item => item.trim()),
      responsibilities: responsibilities.split(',').map(item => item.trim()),
    };

    // Send job data to the backend
    axios.post('http://localhost:5000/jobs', newJob)
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "This new Job has been saved and published",
            showConfirmButton: false,
            timer: 1500
          });
        }
        // console.log('Job submitted successfully:', res.data);
        // e.target.reset();
      })
      .catch(err => {
        console.error('Error submitting job:', err);
      });
  };



  return (
    <div className="max-w-4xl mx-auto p-8 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center">Add New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Job Basics */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Job Details</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Job Title</span>
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Location</span>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="input input-bordered w-full"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Job Type</span>
              <select
                name="jobType"
                className="select select-bordered w-full"
                defaultValue=""
                required
              >
                <option value="" disabled>Choose Job Type</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Category</span>
              <select
                name="category"
                className="select select-bordered w-full"
                defaultValue=""
                required
              >
                <option value="" disabled>Choose Category</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Application Deadline</span>
              <input
                type="date"
                name="applicationDeadline"
                className="input input-bordered w-full"
                required
              />
            </label>
          </div>
        </fieldset>

        {/* Salary */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Salary Details</legend>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="flex flex-col flex-1 min-w-[120px]">
              <span className="mb-1 font-medium">Min Salary</span>
              <input
                type="number"
                name="minSalary"
                placeholder="Min Salary"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="flex flex-col flex-1 min-w-[120px]">
              <span className="mb-1 font-medium">Max Salary</span>
              <input
                type="number"
                name="maxSalary"
                placeholder="Max Salary"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="flex flex-col w-36 min-w-[120px]">
              <span className="mb-1 font-medium">Currency</span>
              <select
                name="currency"
                className="select select-bordered w-full"
                defaultValue="bdt"
              >
                <option value="bdt">BDT</option>
                <option value="usd">USD</option>
              </select>
            </label>
          </div>
        </fieldset>

        {/* Company Info */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Company Information</legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Company Name</span>
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Company Logo URL</span>
              <input
                type="url"
                name="company_logo"
                placeholder="https://example.com/logo.png"
                className="input input-bordered w-full"
                required
              />
            </label>
          </div>
        </fieldset>

        {/* Job Description */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Job Description & Details</legend>

          <label className="flex flex-col">
            <span className="mb-1 font-medium">Job Description</span>
            <textarea
              name="description"
              placeholder="Job Description"
              className="textarea textarea-bordered w-full"
              rows={4}
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 font-medium">Requirements (comma-separated)</span>
            <textarea
              name="requirements"
              placeholder="e.g. React, Node.js, REST API"
              className="textarea textarea-bordered w-full"
              rows={2}
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 font-medium">Responsibilities (comma-separated)</span>
            <textarea
              name="responsibilities"
              placeholder="e.g. Develop UI, Write tests"
              className="textarea textarea-bordered w-full"
              rows={2}
              required
            />
          </label>
        </fieldset>

        {/* HR Contact & Status */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">HR Contact & Job Status</legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">HR Email</span>
              <input
                type="email"
                name="hr_email"
                defaultValue={user.email}
                placeholder="HR Email"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">HR Name</span>
              <input
                type="text"
                name="hr_name"
                defaultValue={user.displayName}
                placeholder="HR Name"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Status</span>
              <select
                name="status"
                className="select select-bordered w-full"
                defaultValue="active"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full text-lg font-semibold"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AddJob;
