import AsyncStorage from "@react-native-async-storage/async-storage";
import listadoEjercicios from "./ejercicios";

const MUSCLE_GROUPS_URL = "https://rutina360-server.onrender.com/muscleGroup";
const EXERCISES_URL = "https://rutina360-server.onrender.com/ejercice";
const DEFAULT_EXERCISE_SECONDS = 40;
const CATALOG_CACHE_KEY = "@rutina360/catalogo_ejercicios_v1";
export const CATALOG_REFRESH_MS = 12 * 60 * 60 * 1000;

const normalizarTexto = texto =>
  texto
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const construirCategorias = (catalogo = []) =>
  Array.from(new Set(catalogo.map(item => item.categoria).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b));

const toOwnerIds = usuarioBackend =>
  Array.from(
    new Set(
      [1, usuarioBackend?.id, usuarioBackend?.idAdminOwner, usuarioBackend?.adminOwner?.id]
        .map(id => Number(id))
        .filter(Number.isFinite)
    )
  );

const aplicarFiltroOwner = (items, allowedOwnerIds) =>
  items.filter(item => {
    const ownerId = Number(item?.idOwner);
    return Number.isFinite(ownerId) && allowedOwnerIds.includes(ownerId);
  });

const mapearCatalogoRemoto = (groups, exercises, allowedOwnerIds) => {
  const groupsMap = new Map(
    groups.map(group => [
      group.id,
      { ...group, categoriaNormalizada: normalizarTexto(group.name) },
    ])
  );

  return aplicarFiltroOwner(exercises, allowedOwnerIds).map(item => {
    const grupo = groupsMap.get(item?.idMuscleGroup);
    return {
      idEjercicio: item.id,
      categoria: grupo?.categoriaNormalizada || "",
      nombre: item.name || "Ejercicio",
      tiempoEjecucion: DEFAULT_EXERCISE_SECONDS,
      idOwner: item.idOwner,
      idMuscleGroup: item.idMuscleGroup,
    };
  });
};

export const getCatalogoFallback = () => ({
  catalogo: listadoEjercicios,
  categorias: construirCategorias(listadoEjercicios),
  source: "fallback",
  updatedAt: null,
});

export const cargarCatalogoCache = async () => {
  try {
    const cacheRaw = await AsyncStorage.getItem(CATALOG_CACHE_KEY);
    if (!cacheRaw) return null;
    const cache = JSON.parse(cacheRaw);
    if (!Array.isArray(cache?.catalogo) || cache.catalogo.length === 0) return null;

    return {
      catalogo: cache.catalogo,
      categorias: Array.isArray(cache?.categorias) && cache.categorias.length
        ? cache.categorias
        : construirCategorias(cache.catalogo),
      updatedAt: cache?.updatedAt || null,
      source: "cache",
    };
  } catch {
    return null;
  }
};

export const guardarCatalogoCache = async ({ catalogo, categorias }) => {
  await AsyncStorage.setItem(
    CATALOG_CACHE_KEY,
    JSON.stringify({
      catalogo,
      categorias,
      updatedAt: new Date().toISOString(),
    })
  );
};

export const refrescarCatalogoRemoto = async (usuarioBackend) => {
  const [resGroups, resExercises] = await Promise.all([
    fetch(MUSCLE_GROUPS_URL),
    fetch(EXERCISES_URL),
  ]);

  if (!resGroups.ok || !resExercises.ok) {
    throw new Error("No se pudo cargar el catalogo.");
  }

  const groupsBody = await resGroups.json().catch(() => ({}));
  const exercisesBody = await resExercises.json().catch(() => ({}));

  const groups = Array.isArray(groupsBody?.data) ? groupsBody.data : [];
  const exercises = Array.isArray(exercisesBody?.data) ? exercisesBody.data : [];
  const allowedOwnerIds = toOwnerIds(usuarioBackend);
  const catalogo = mapearCatalogoRemoto(groups, exercises, allowedOwnerIds);

  if (!catalogo.length) {
    throw new Error("No se encontraron ejercicios remotos para el usuario.");
  }

  const categorias = construirCategorias(catalogo);
  await guardarCatalogoCache({ catalogo, categorias });

  return {
    catalogo,
    categorias,
    source: "remote",
    updatedAt: new Date().toISOString(),
  };
};

export const getCatalogoLocalConRefresh = async ({
  usuarioBackend,
  refreshMs = CATALOG_REFRESH_MS,
}) => {
  const cache = await cargarCatalogoCache();
  if (!cache) {
    return { ...getCatalogoFallback(), needsRefresh: true };
  }

  const lastUpdateMs = cache.updatedAt ? new Date(cache.updatedAt).getTime() : 0;
  const now = Date.now();
  const needsRefresh = !lastUpdateMs || now - lastUpdateMs >= refreshMs;

  return { ...cache, needsRefresh };
};
