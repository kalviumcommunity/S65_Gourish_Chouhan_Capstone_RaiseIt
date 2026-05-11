import { API_BASE_URL } from "../config";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export function registerUser(data) {
  return request("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export function loginUser(data) {
  return request("/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`;
}

export function getConcerns(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/concerns${query ? `?${query}` : ""}`);
}

export function getConcern(id) {
  return request(`/concerns/${id}`);
}

export function createConcern(data) {
  return request("/concerns", { method: "POST", body: JSON.stringify(data) });
}

export function updateConcern(id, data) {
  return request(`/concerns/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteConcern(id) {
  return request(`/concerns/${id}`, { method: "DELETE" });
}

export function toggleConcernUpvote(id) {
  return request(`/concerns/${id}/upvote`, { method: "POST" });
}

export function addConcernComment(id, text) {
  return request(`/concerns/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function reportConcern(id, reason) {
  return request(`/concerns/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return request("/upload", { method: "POST", body: formData });
}

export function createPaymentOrder(amount, metadata = {}) {
  return request("/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ amount, ...metadata }),
  });
}

export function verifyPayment(data) {
  return request("/payments/verify", { method: "POST", body: JSON.stringify(data) });
}

export function sendGeminiMessage(message) {
  return request("/gemini/chat", { method: "POST", body: JSON.stringify({ message }) });
}

export function getGroups(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/groups${query ? `?${query}` : ""}`);
}

export function createGroup(data) {
  return request("/groups", { method: "POST", body: JSON.stringify(data) });
}

export function getGroup(id) {
  return request(`/groups/${id}`);
}

export function joinGroup(id) {
  return request(`/groups/${id}/join`, { method: "POST" });
}

export function leaveGroup(id) {
  return request(`/groups/${id}/leave`, { method: "POST" });
}

export function getGroupDiscussions(id) {
  return request(`/groups/${id}/discussions`);
}

export function createDiscussion(groupId, data) {
  return request(`/groups/${groupId}/discussions`, { method: "POST", body: JSON.stringify(data) });
}

export function getDiscussion(groupId, discussionId) {
  return request(`/groups/${groupId}/discussions/${discussionId}`);
}

export function addDiscussionReply(groupId, discussionId, content) {
  return request(`/groups/${groupId}/discussions/${discussionId}/replies`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function reportGroup(id, reason) {
  return request(`/groups/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function reportDiscussion(groupId, discussionId, reason) {
  return request(`/groups/${groupId}/discussions/${discussionId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function getAdminSummary() {
  return request("/admin/summary");
}

export function getAdminReports() {
  return request("/admin/reports");
}

export function moderateContent(type, id, action) {
  return request(`/admin/${type}/${id}/${action}`, { method: "PATCH" });
}

export function deleteModeratedContent(type, id) {
  return request(`/admin/${type}/${id}`, { method: "DELETE" });
}

export function getCauses(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/causes${query ? `?${query}` : ""}`);
}

export function createCause(data) {
  return request("/admin/causes", { method: "POST", body: JSON.stringify(data) });
}

export function updateCause(id, data) {
  return request(`/admin/causes/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteCause(id) {
  return request(`/admin/causes/${id}`, { method: "DELETE" });
}

export function getMe() {
  return request("/users/me");
}

export function getUser(id) {
  return request(`/users/${id}`);
}

export function updateMe(data) {
  return request("/users/me", { method: "PUT", body: JSON.stringify(data) });
}

export function getUserConcerns(id) {
  return request(`/users/${id}/concerns`);
}

export function getUserGroups(id) {
  return request(`/users/${id}/groups`);
}

export function getUserDonations(id) {
  return request(`/users/${id}/donations`);
}
