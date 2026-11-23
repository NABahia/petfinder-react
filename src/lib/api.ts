export const API_BASE_URL =
  process.env.API_BASE_URL || "https://petfinder-atlz.onrender.com";

const TOKEN_STORAGE_KEY = "token";

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

export function setStoredToken(token: string) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export interface PetItem {
  id?: number;
  objectID?: string | number;
  name: string;
  location: string;
  lat?: number;
  lng?: number;
  _geoloc?: {
    lat: number;
    lng: number;
  };
  petImageUrl?: string;
  status?: "lost" | "found" | string;
  userId?: number;
}

export interface UserProfile {
  userId?: number;
  id?: number;
  name: string;
  email: string;
}

let onUnauthorizedCallback: (() => void) | null = null;

export function registerUnauthorizedHandler(cb: () => void) {
  onUnauthorizedCallback = cb;
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    setStoredToken("");
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    throw new Error("Tu sesión expiró. Por favor volvé a iniciar sesión.");
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Error en la consulta a la API.");
  }

  return data as T;
}

// --- Endpoints de Autenticación y Usuario ---

export async function apiLogin(email: string, password: string) {
  return fetchAPI<{ token: string }>("/auth/token", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(data: {
  name: string;
  email: string;
  password: string;
}) {
  return fetchAPI<{ newUser: UserProfile }>("/auth", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetMe() {
  return fetchAPI<UserProfile>("/user/me");
}

export async function apiUpdateMe(data: {
  fullname: string;
  password?: string;
}) {
  return fetchAPI<{ message: string; user: UserProfile }>("/user/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// --- Endpoints de Mascotas ---

export async function apiGetNearbyPets(lat: number, lng: number) {
  return fetchAPI<{ resultados: number; mascotas: PetItem[] }>(
    `/pets/cerca?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
  );
}

export async function apiGetMyPets() {
  return fetchAPI<PetItem[]>("/user/me/pets");
}

export async function apiGetAllPets() {
  return fetchAPI<PetItem[]>("/pets");
}

export async function apiGetPetById(id: string | number) {
  try {
    return await fetchAPI<PetItem>(`/pets/${encodeURIComponent(id)}`);
  } catch {
    // Fallback si el backend viejo no tenía GET /pets/:id expuesto
    const allPets = await apiGetAllPets();
    const found = allPets.find(
      (p) => String(p.id) === String(id) || String(p.objectID) === String(id)
    );
    if (!found) {
      throw new Error("No se encontró la mascota solicitada.");
    }
    return found;
  }
}

export async function apiCreatePet(data: {
  name: string;
  location: string;
  lat: number;
  lng: number;
  pictureData: string;
}) {
  return fetchAPI<{ newPet: PetItem }>("/pets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdatePet(
  id: string | number,
  data: {
    name?: string;
    location?: string;
    lat?: number;
    lng?: number;
    pictureData?: string;
    status?: string;
  }
) {
  return fetchAPI<{ message: string; pet: PetItem }>(
    `/pets/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function apiDeletePet(id: string | number) {
  return fetchAPI<{ ok: boolean; message: string }>(
    `/pets/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

// --- Endpoints de Reporte de Avistamiento ---

export async function apiReportSighting(
  petId: string | number,
  data: {
    reporterName: string;
    phone: string;
    location: string;
    lat: number;
    lng: number;
    pictureData?: string;
  }
) {
  return fetchAPI<{ ok: boolean; report: any }>(
    `/pets/${encodeURIComponent(petId)}/report`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
