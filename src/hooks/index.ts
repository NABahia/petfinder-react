import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  apiCreatePet,
  apiDeletePet,
  apiGetMe,
  apiGetMyPets,
  apiGetNearbyPets,
  apiGetPetById,
  apiLogin,
  apiRegister,
  apiReportSighting,
  apiUpdateMe,
  apiUpdatePet,
  getStoredToken,
  PetItem,
  registerUnauthorizedHandler,
  setStoredToken,
  UserProfile,
} from "../lib/api";

interface GlobalAppState {
  token: string;
  user: UserProfile | null;
  userLocation: { lat: number; lng: number } | null;
  nearbyPets: PetItem[];
  nearbyLoading: boolean;
  nearbyError: string | null;
  hasRequestedLocation: boolean;
}

let appState: GlobalAppState = {
  token: getStoredToken(),
  user: null,
  userLocation: null,
  nearbyPets: [],
  nearbyLoading: false,
  nearbyError: null,
  hasRequestedLocation: false,
};

const listeners = new Set<() => void>();

function setAppState(partial: Partial<GlobalAppState>) {
  appState = { ...appState, ...partial };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return appState;
}

registerUnauthorizedHandler(() => {
  setAppState({ token: "", user: null });
});

// --- Hook de Autenticación y Sesión ---

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.token && !state.user) {
      apiGetMe()
        .then((userData) => {
          setAppState({ user: userData });
        })
        .catch(() => {
          // Si falla silenciosamente, el handler de 401 limpiará el token si corresponde
        });
    }
  }, [state.token, state.user]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(email, password);
      setStoredToken(data.token);
      setAppState({ token: data.token });
      return true;
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar sesión.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await apiRegister({ name, email, password });
        return true;
      } catch (err: any) {
        setError(err?.message || "No se pudo crear la cuenta.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setStoredToken("");
    setAppState({ token: "", user: null });
  }, []);

  return {
    token: state.token,
    isAuthenticated: Boolean(state.token),
    user: state.user,
    loading,
    error,
    setError,
    login,
    register,
    logout,
  };
}

// --- Hook de Datos del Usuario (/mis-datos) ---

export function useUserData() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  const [fullname, setFullname] = useState(state.user?.name || "");
  const [email, setEmail] = useState(state.user?.email || "");
  const [loading, setLoading] = useState(!state.user);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!state.token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    apiGetMe()
      .then((userData) => {
        if (!cancelled && userData) {
          setFullname(userData.name || "");
          setEmail(userData.email || "");
          setAppState({ user: userData });
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setIsError(true);
          setStatusMsg(err?.message || "Error al cargar tus datos.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state.token]);

  const updateProfile = useCallback(
    async (newFullname: string, newPassword?: string) => {
      setSaving(true);
      setStatusMsg(null);
      setIsError(false);
      try {
        const payload: { fullname: string; password?: string } = {
          fullname: newFullname,
        };
        if (newPassword && newPassword.trim() !== "") {
          payload.password = newPassword;
        }
        const res = await apiUpdateMe(payload);
        setFullname(newFullname);
        if (res.user) {
          setAppState({ user: res.user });
        }
        setStatusMsg("✅ Datos actualizados correctamente");
        return true;
      } catch (err: any) {
        setIsError(true);
        setStatusMsg("❌ " + (err?.message || "No se pudieron guardar los cambios."));
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return {
    fullname,
    setFullname,
    email,
    loading,
    saving,
    statusMsg,
    isError,
    updateProfile,
  };
}

// --- Hook de Mascotas Cercanas (Home) ---

export function useNearbyPets() {
  const state = useSyncExternalStore(subscribe, getSnapshot);

  const searchAtCoords = useCallback(async (lat: number, lng: number) => {
    setAppState({
      userLocation: { lat, lng },
      nearbyLoading: true,
      nearbyError: null,
      hasRequestedLocation: true,
    });

    try {
      const response = await apiGetNearbyPets(lat, lng);
      setAppState({
        nearbyPets: response.mascotas || [],
        nearbyLoading: false,
        nearbyError: null,
      });
    } catch (err: any) {
      setAppState({
        nearbyLoading: false,
        nearbyError:
          err?.message || "Error al buscar mascotas cercanas en este momento.",
      });
    }
  }, []);

  const requestLocationAndSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setAppState({
        nearbyError: "Tu navegador no soporta geolocalización.",
        hasRequestedLocation: true,
      });
      return;
    }

    setAppState({
      nearbyLoading: true,
      nearbyError: null,
      hasRequestedLocation: true,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        searchAtCoords(lat, lng);
      },
      () => {
        setAppState({
          nearbyLoading: false,
          nearbyError:
            "Necesitamos permiso para conocer tu ubicación y mostrarte las mascotas perdidas cerca tuyo.",
        });
      }
    );
  }, [searchAtCoords]);

  return {
    nearbyPets: state.nearbyPets,
    loading: state.nearbyLoading,
    error: state.nearbyError,
    hasRequestedLocation: state.hasRequestedLocation,
    userLocation: state.userLocation,
    requestLocationAndSearch,
  };
}

// --- Hook de Mis Mascotas Reportadas (/mis-mascotas) ---

export function useMyPets() {
  const [pets, setPets] = useState<PetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetMyPets();
      setPets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Error al cargar tus mascotas reportadas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPets();
  }, [fetchMyPets]);

  return {
    pets,
    loading,
    error,
    refreshPets: fetchMyPets,
  };
}

// --- Hook para Crear / Editar Mascota (/reportar y /editar-mascota/:id) ---

export function usePetForm(petId?: string) {
  const [initialPet, setInitialPet] = useState<PetItem | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(Boolean(petId));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setInitialPet(null);
      setLoadingInitial(false);
      return;
    }

    let cancelled = false;
    setLoadingInitial(true);
    setError(null);

    apiGetPetById(petId)
      .then((pet) => {
        if (!cancelled) {
          setInitialPet(pet);
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err?.message || "No se pudo cargar la mascota.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingInitial(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [petId]);

  const savePet = useCallback(
    async (data: {
      name: string;
      location: string;
      lat: number;
      lng: number;
      pictureData: string;
    }) => {
      setSubmitting(true);
      setError(null);
      try {
        if (petId) {
          await apiUpdatePet(petId, data);
        } else {
          await apiCreatePet(data);
        }
        return true;
      } catch (err: any) {
        setError(err?.message || "No se pudo guardar la mascota.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [petId]
  );

  const deleteOrUnpublishPet = useCallback(async () => {
    if (!petId) return false;
    setSubmitting(true);
    setError(null);
    try {
      await apiDeletePet(petId);
      return true;
    } catch (err: any) {
      setError(err?.message || "No se pudo eliminar la publicación.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [petId]);

  return {
    initialPet,
    loadingInitial,
    submitting,
    error,
    setError,
    savePet,
    deleteOrUnpublishPet,
  };
}

// --- Hook para Reportar Avistamiento (/mascota/:id) ---

export function useReportSighting(petId?: string) {
  const [pet, setPet] = useState<PetItem | null>(null);
  const [loadingPet, setLoadingPet] = useState<boolean>(Boolean(petId));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) return;

    let cancelled = false;
    // Primero revisamos si está en la caché de mascotas cercanas
    const cached = appState.nearbyPets.find(
      (p) =>
        String(p.objectID) === String(petId) || String(p.id) === String(petId)
    );
    if (cached) {
      setPet(cached);
    }

    setLoadingPet(true);
    apiGetPetById(petId)
      .then((data) => {
        if (!cancelled && data) {
          setPet(data);
        }
      })
      .catch(() => {
        // Si falla pero teníamos cached, mantenemos cached
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingPet(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [petId]);

  const submitSighting = useCallback(
    async (data: {
      reporterName: string;
      phone: string;
      location: string;
      lat: number;
      lng: number;
      pictureData?: string;
    }) => {
      if (!petId) return false;
      setSubmitting(true);
      setError(null);
      try {
        await apiReportSighting(petId, data);
        return true;
      } catch (err: any) {
        setError(err?.message || "No se pudo enviar el reporte.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [petId]
  );

  return {
    pet,
    loadingPet,
    submitting,
    error,
    setError,
    submitSighting,
  };
}
