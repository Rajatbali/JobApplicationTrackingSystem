// const API_BASE_URL = "http://localhost:8080/api/applications";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/applications`;

// GET ALL APPLICATIONS
export const getApplications = async ({
  search = "",
  status = "",
  page = 0,
  size = 10,
  sortBy = "applicationDate",
  direction = "desc",
} = {}) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  params.append("page", page);
  params.append("size", size);
  params.append("sortBy", sortBy);
  params.append("direction", direction);

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
};


// GET APPLICATION BY ID
export const getApplicationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch application");
  }

  return response.json();
};


// GET DASHBOARD
export const getDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
};


// CREATE APPLICATION
export const createApplication = async (application) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to create application"
    );
  }

  return response.json();
};


// UPDATE COMPLETE APPLICATION
export const updateApplication = async (id, application) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to update application"
    );
  }

  return response.json();
};


// UPDATE STATUS ONLY
export const updateApplicationStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to update application status"
    );
  }

  return response.json();
};


// DELETE APPLICATION
export const deleteApplication = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to delete application"
    );
  }

  // DELETE returns 204 No Content
  return true;
};
