// Migrated from axios/json-server to Supabase
// All API calls now use Supabase client and preserve a similar response shape
import { supabase } from "../lib/supabase";

const handleResponse = ({ data, error }) => {
  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }
  return data ?? [];
};

// Alternatif endpoints (Supabase)
export const getAlternatif = async () => {
  const result = await supabase.from("alternatif").select("*");
  return { data: handleResponse(result) };
};

export const getAlternatifById = async (id) => {
  const result = await supabase.from("alternatif").select("*").eq("id", id);
  return { data: handleResponse(result) };
};

export const createAlternatif = async (data) => {
  try {
    const payload = { ...data };
    // attempt to get current user id from Supabase Auth and set owner
    try {
      const userRes = await supabase.auth.getUser();
      const user = userRes?.data?.user;
      if (user && !payload.owner) payload.owner = user.id;
    } catch (e) {
      // ignore if auth not available in this environment
    }

    const result = await supabase.from("alternatif").insert([payload]);
    return { data: handleResponse(result) };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateAlternatif = async (id, data) => {
  const result = await supabase.from("alternatif").update(data).eq("id", id);
  return { data: handleResponse(result) };
};

export const deleteAlternatif = async (id) => {
  const result = await supabase.from("alternatif").delete().eq("id", id);
  return { data: handleResponse(result) };
};

// Kriteria / AHP endpoints (Supabase)
export const getKriteria = async () => {
  const result = await supabase.from("kriteria").select("*");
  return { data: handleResponse(result) };
};

export const createKriteria = async (data) => {
  const result = await supabase.from("kriteria").insert([data]);
  return { data: handleResponse(result) };
};

export const updateKriteria = async (id, data) => {
  const result = await supabase.from("kriteria").update(data).eq("id", id);
  return { data: handleResponse(result) };
};

export const deleteKriteria = async (id) => {
  const result = await supabase.from("kriteria").delete().eq("id", id);
  return { data: handleResponse(result) };
};

// Nilai endpoints
export const getNilai = async () => {
  const result = await supabase.from("nilai").select("*");
  return { data: handleResponse(result) };
};

// Hasil endpoints
export const getHasil = async () => {
  const result = await supabase.from("hasil").select("*");
  return { data: handleResponse(result) };
};

export const createHasil = async (data) => {
  const result = await supabase.from("hasil").insert([data]);
  return { data: handleResponse(result) };
};

export const deleteHasil = async (id) => {
  const result = await supabase.from("hasil").delete().eq("id", id);
  return { data: handleResponse(result) };
};

// Default API object to preserve previous `API.get/post/put/delete` usage
const API = {
  // GET /table or GET /table/:id
  get: async (path) => {
    const parts = path.replace(/^\//, "").split("/");
    const table = parts[0];
    const id = parts[1];
    const response = id
      ? await supabase.from(table).select("*").eq("id", id)
      : await supabase.from(table).select("*");
    return { data: handleResponse(response) };
  },

  // POST /table
  post: async (path, payload) => {
    const table = path.replace(/^\//, "").split("/")[0];
    const response = await supabase.from(table).insert([payload]);
    return { data: handleResponse(response) };
  },

  // PUT /table/:id
  put: async (path, payload) => {
    const parts = path.replace(/^\//, "").split("/");
    const table = parts[0];
    const id = parts[1];
    const response = await supabase.from(table).update(payload).eq("id", id);
    return { data: handleResponse(response) };
  },

  // DELETE /table/:id
  delete: async (path) => {
    const parts = path.replace(/^\//, "").split("/");
    const table = parts[0];
    const id = parts[1];
    if (!id) {
      return { data: null, error: new Error("Missing id for delete operation") };
    }
    const response = await supabase.from(table).delete().eq("id", id);
    return { data: handleResponse(response) };
  },
};

export default API;