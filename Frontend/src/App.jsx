import "./App.css";
import { useEffect, useRef, useState } from "react";

import {
  getApplications,
  getDashboard,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "./api/applicationApi";


function App() {

  // --------------------------------------------------
  // UI STATE
  // --------------------------------------------------

  
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const formRef = useRef(null);

  const [applications, setApplications] = useState([]);

  const [dashboard, setDashboard] = useState({
    totalApplications: 0,
    applied: 0,
    screening: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    withdrawn: 0,
  });


  // --------------------------------------------------
  // LOADING / ERROR / SUCCESS
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");


  // --------------------------------------------------
  // SEARCH / FILTER / PAGINATION / SORT
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);

  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [sortBy, setSortBy] = useState("applicationDate");

  const [direction, setDirection] = useState("desc");


  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  const emptyForm = {
    companyName: "",
    jobTitle: "",
    jobUrl: "",
    location: "",
    employmentType: "",
    salaryRange: "",
    applicationDate: "",
    status: "APPLIED",
    notes: "",
    interviewDate: "",
  };


  const [formData, setFormData] = useState(emptyForm);


  // --------------------------------------------------
  // LOAD APPLICATIONS
  // --------------------------------------------------

  const loadApplications = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getApplications({
        search,
        status: statusFilter,
        page,
        size,
        sortBy,
        direction,
      });


      setApplications(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(data.totalElements || 0);

    } catch (err) {

      console.error(err);

      setError(err.message || "Failed to load applications");

    } finally {

      setLoading(false);

    }
  };


  // --------------------------------------------------
  // LOAD DASHBOARD
  // --------------------------------------------------

  const loadDashboard = async () => {

    try {

      const data = await getDashboard();

      setDashboard(data);

    } catch (err) {

      console.error(err);

      setError(err.message || "Failed to load dashboard");

    }
  };


  // --------------------------------------------------
  // LOAD EVERYTHING
  // --------------------------------------------------

  const loadData = async () => {

    await Promise.all([
      loadApplications(),
      loadDashboard(),
    ]);

  };


  // --------------------------------------------------
  // INITIAL LOAD + FILTER CHANGES
  // --------------------------------------------------

  useEffect(() => {

    loadApplications();

  }, [
    page,
    statusFilter,
    sortBy,
    direction,
  ]);


  useEffect(() => {

    loadDashboard();

  }, []);


  // --------------------------------------------------
  // FORM INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {

    setFormData(emptyForm);

    setEditingId(null);

    setShowForm(false);

  };


  // --------------------------------------------------
  // PREPARE API PAYLOAD
  // --------------------------------------------------

  const preparePayload = () => {

    return {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      jobUrl: formData.jobUrl,
      location: formData.location,
      employmentType: formData.employmentType,
      salaryRange: formData.salaryRange,
      applicationDate: formData.applicationDate,
      status: formData.status,
      notes: formData.notes,

      // Backend expects LocalDate or null
      interviewDate:
        formData.interviewDate === ""
          ? null
          : formData.interviewDate,
    };

  };


  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      setError("");

      setSuccessMessage("");


      const payload = preparePayload();


      if (editingId) {

        // PUT
        await updateApplication(
          editingId,
          payload
        );

        setSuccessMessage(
          "Application updated successfully."
        );

      } else {

        // POST
        await createApplication(payload);

        setSuccessMessage(
          "Application created successfully."
        );

      }


      resetForm();

      // Refresh list and dashboard
      await loadApplications();

      await loadDashboard();

    } catch (err) {

      console.error(err);

      setError(
        err.message || "Something went wrong."
      );

    } finally {

      setSaving(false);

    }

  };


  // --------------------------------------------------
  // EDIT APPLICATION
  // --------------------------------------------------

const handleEdit = (application) => {
  setEditingId(application.id);

  setFormData({
    companyName: application.companyName || "",
    jobTitle: application.jobTitle || "",
    jobUrl: application.jobUrl || "",
    location: application.location || "",
    employmentType: application.employmentType || "",
    salaryRange: application.salaryRange || "",
    applicationDate: application.applicationDate || "",
    status: application.status || "APPLIED",
    notes: application.notes || "",
    interviewDate: application.interviewDate || "",
  });

  setShowForm(true);

  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};


  // --------------------------------------------------
  // STATUS UPDATE
  // --------------------------------------------------

  const handleStatusChange = async (
    id,
    newStatus
  ) => {

    try {

      setUpdatingStatusId(id);

      setError("");

      setSuccessMessage("");


      await updateApplicationStatus(
        id,
        newStatus
      );


      setSuccessMessage(
        "Application status updated successfully."
      );


      await loadApplications();

      await loadDashboard();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Failed to update application status."
      );

    } finally {

      setUpdatingStatusId(null);

    }

  };


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);

      setError("");

      setSuccessMessage("");


      await deleteApplication(id);


      setSuccessMessage(
        "Application deleted successfully."
      );


      // If last item on a page was deleted,
      // move back one page.
      if (
        applications.length === 1 &&
        page > 0
      ) {

        setPage(page - 1);

      } else {

        await loadApplications();

      }


      await loadDashboard();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Failed to delete application."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSearch = (event) => {

    event.preventDefault();

    setPage(0);

    loadApplications();

  };


  // --------------------------------------------------
  // CLEAR SEARCH
  // --------------------------------------------------

  const handleClearSearch = () => {

    setSearch("");

    setPage(0);

  };


  // --------------------------------------------------
  // STATUS DISPLAY
  // --------------------------------------------------

  const getStatusLabel = (status) => {

    const labels = {
      APPLIED: "Applied",
      SCREENING: "Screening",
      INTERVIEW: "Interview",
      OFFER: "Offer",
      REJECTED: "Rejected",
      WITHDRAWN: "Withdrawn",
    };

    return labels[status] || status;

  };


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="app">


      {/* HEADER */}

      <div className="header">

        <div>

          <h1>
            Job Application Tracker
          </h1>

          <p>
            Track and manage your job applications.
          </p>

        </div>


        <button
          className="add-button"
          onClick={() => {

            setEditingId(null);

            setFormData(emptyForm);

            setShowForm(true);

            setError("");

            setSuccessMessage("");

          }}
        >
          + Add Application
        </button>

      </div>


      {/* SUCCESS MESSAGE */}

      {successMessage && (

        <div className="success-message">
          {successMessage}
        </div>

      )}


      {/* ERROR MESSAGE */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* DASHBOARD */}

      <div className="stats">


        <div className="stat-card">

          <h3>
            Total Applications
          </h3>

          <p>
            {dashboard.totalApplications}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Applied
          </h3>

          <p>
            {dashboard.applied}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Interviews
          </h3>

          <p>
            {dashboard.interviews}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Offers
          </h3>

          <p>
            {dashboard.offers}
          </p>

        </div>


      </div>


      {/* SEARCH / FILTER */}

      <div className="applications">


        <h2>
          Recent Applications
        </h2>


        <div className="filters">


          <form onSubmit={handleSearch}>

            <input
              type="text"
              placeholder="Search company or job title..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button type="submit">
              Search
            </button>

            <button
              type="button"
              onClick={handleClearSearch}
            >
              Clear
            </button>

          </form>


          <select
            value={statusFilter}
            onChange={(event) => {

              setStatusFilter(
                event.target.value
              );

              setPage(0);

            }}
          >

            <option value="">
              All Statuses
            </option>

            <option value="APPLIED">
              Applied
            </option>

            <option value="SCREENING">
              Screening
            </option>

            <option value="INTERVIEW">
              Interview
            </option>

            <option value="OFFER">
              Offer
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="WITHDRAWN">
              Withdrawn
            </option>

          </select>


          <select
            value={sortBy}
            onChange={(event) => {

              setSortBy(
                event.target.value
              );

              setPage(0);

            }}
          >

            <option value="applicationDate">
              Application Date
            </option>

            <option value="companyName">
              Company
            </option>

            <option value="jobTitle">
              Job Title
            </option>

            <option value="status">
              Status
            </option>

          </select>


          <select
            value={direction}
            onChange={(event) => {

              setDirection(
                event.target.value
              );

              setPage(0);

            }}
          >

            <option value="desc">
              Descending
            </option>

            <option value="asc">
              Ascending
            </option>

          </select>


        </div>


        {/* APPLICATION LIST */}

        {loading ? (

          <p className="empty-message">
            Loading applications...
          </p>

        ) : applications.length === 0 ? (

          <p className="empty-message">
            No applications found.
          </p>

        ) : (

          <div className="application-list">

            {applications.map((application) => (

              <div
                className="application-card"
                key={application.id}
              >


                <div>

                  <h3>
                    {application.companyName}
                  </h3>

                  <p>
                    {application.jobTitle}
                  </p>

                  <p>
                    {application.location}
                  </p>

                  <p>
                    {application.applicationDate}
                  </p>

                </div>


                <div>

                  <select
                    value={application.status}
                    disabled={
                      updatingStatusId ===
                      application.id
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        application.id,
                        event.target.value
                      )
                    }
                  >

                    <option value="APPLIED">
                      Applied
                    </option>

                    <option value="SCREENING">
                      Screening
                    </option>

                    <option value="INTERVIEW">
                      Interview
                    </option>

                    <option value="OFFER">
                      Offer
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>

                    <option value="WITHDRAWN">
                      Withdrawn
                    </option>

                  </select>


                  <p>
                    {getStatusLabel(
                      application.status
                    )}
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(application)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    disabled={
                      deletingId ===
                      application.id
                    }
                    onClick={() =>
                      handleDelete(
                        application.id
                      )
                    }
                  >

                    {deletingId ===
                    application.id
                      ? "Deleting..."
                      : "Delete"}

                  </button>

                </div>


              </div>

            ))}

          </div>

        )}


        {/* PAGINATION */}

        {!loading &&
          totalPages > 0 && (

            <div className="pagination">

              <button
                disabled={page === 0}
                onClick={() =>
                  setPage(page - 1)
                }
              >
                Previous
              </button>


              <span>
                Page {page + 1} of {totalPages}
              </span>


              <button
                disabled={
                  page >= totalPages - 1
                }
                onClick={() =>
                  setPage(page + 1)
                }
              >
                Next
              </button>

            </div>

          )}


        <p>
          Total results: {totalElements}
        </p>


      </div>


      {/* ADD / EDIT FORM */}

      {showForm && (

        <div ref={formRef} className="form-container">


          <h2>

            {editingId
              ? "Edit Job Application"
              : "Add Job Application"}

          </h2>


          <form onSubmit={handleSubmit}>


            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />


            <input
              type="url"
              name="jobUrl"
              placeholder="Job URL"
              value={formData.jobUrl}
              onChange={handleChange}
            />


            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />


            <input
              type="text"
              name="employmentType"
              placeholder="Employment Type"
              value={formData.employmentType}
              onChange={handleChange}
            />


            <input
              type="text"
              name="salaryRange"
              placeholder="Salary Range"
              value={formData.salaryRange}
              onChange={handleChange}
            />


            <label>
              Application Date
            </label>

            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              required
            />


            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

              <option value="APPLIED">
                Applied
              </option>

              <option value="SCREENING">
                Screening
              </option>

              <option value="INTERVIEW">
                Interview
              </option>

              <option value="OFFER">
                Offer
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="WITHDRAWN">
                Withdrawn
              </option>

            </select>


            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />


            <label>
              Interview Date
            </label>

            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
            />


            <div className="form-buttons">


              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Application"
                    : "Save Application"}

              </button>


              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>


            </div>


          </form>


        </div>

      )}


    </div>

  );

}


export default App;