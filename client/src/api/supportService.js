import axios from "axios";
import { createAuthConfig } from "./authConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/support`;

export const createSupportTicket = async (payload) => {
  const response = await axios.post(API_URL, payload, createAuthConfig());
  return response.data;
};

export const adminGetSupportTickets = async () => {
  const response = await axios.get(API_URL, createAuthConfig());
  return response.data;
};

export const getUserSupportTickets = async () => {
  const response = await axios.get(
    `${API_URL}/my-tickets`,
    createAuthConfig(),
  );
  return response.data;
};

export const adminUpdateSupportTicketStatus = async (ticketId, status, note) => {
  const response = await axios.put(
    `${API_URL}/${encodeURIComponent(ticketId)}/status`,
    { status, note },
    createAuthConfig(),
  );
  return response.data;
};

export const adminAddSupportTimelineEntry = async (ticketId, entry) => {
  const response = await axios.post(
    `${API_URL}/${encodeURIComponent(ticketId)}/timeline`,
    entry,
    createAuthConfig(),
  );
  return response.data;
};

export const adminDownloadSupportAttachment = async (ticketId, attachmentId) => {
  const response = await axios.get(
    `${API_URL}/${encodeURIComponent(ticketId)}/attachments/${encodeURIComponent(attachmentId)}`,
    { ...createAuthConfig(), responseType: "blob" },
  );
  return response.data;
};

