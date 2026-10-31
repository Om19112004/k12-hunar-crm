
const API_BASE_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  submitInquiry: (formData) =>
    apiRequest("/inquiries", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),

  getInquiries: (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const query = params.toString();

    return apiRequest(`/inquiries${query ? `?${query}` : ""}`);
  },

  updateInquiryStatus: (id, status) =>
    apiRequest(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
