import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from '../constants/api';
import { apiJson } from '../services/apiClient';
import listadoEjercicios from "./ejercicios";

const DEFAULT_EXERCISE_SECONDS = 40;
// v2: cada ejercicio guarda su tipo (fuerza / funcional). La clave cambia para
// que la primera apertura despues de actualizar baje el catalogo con los tipos
// en vez de leer el cache viejo, que no los tiene.
const CATALOG_CACHE_KEY = "@rutina360/catalogo_ejercicios_v2";

export const TIPO_CATALOGO_FUERZA = "fuerza";
export const TIPO_CATALOGO_FUNCIONAL = "funcional";

/** Un ejercicio sin tipo es de fuerza (cache o respaldo de antes de los funcionales). */
const tipoDe = item => (item?.tipo === TIPO_CATALOGO_FUNCIONAL ? TIPO_CATALOGO_FUNCIONAL : TIPO_CATALOGO_FUERZA);
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
    const funcional = grupo?.kind === "functional";
    const trabajoSugerido = Number(item?.defaultWorkSeconds) || null;
    return {
      idEjercicio: item.id,
      categoria: grupo?.categoriaNormalizada || "",
      nombre: item.name || "Ejercicio",
      tiempoEjecucion: funcional && trabajoSugerido ? trabajoSugerido : DEFAULT_EXERCISE_SECONDS,
      idOwner: item.idOwner,
      idMuscleGroup: item.idMuscleGroup,
      tipo: funcional ? TIPO_CATALOGO_FUNCIONAL : TIPO_CATALOGO_FUERZA,
      // Nombre tal cual lo cargo el super admin ("Pliometría"): la categoria
      // normalizada pierde los acentos y sirve para comparar, no para mostrar.
      grupo: grupo?.name || "",
      ...(funcional ? { trabajoSugerido } : {}),
    };
  });
};

/**
 * Deja solo los ejercicios de un tipo. El formulario de fuerza ofrece solo
 * Fuerza y el de funcional solo Funcional; por defecto es fuerza, asi que lo
 * que ya llamaba a estas funciones sin tipo sigue viendo lo mismo de siempre.
 */
const filtrarPorTipo = (resultado, tipo = TIPO_CATALOGO_FUERZA) => {
  const catalogo = (resultado?.catalogo || []).filter(item => tipoDe(item) === tipo);
  return { ...resultado, catalogo, categorias: construirCategorias(catalogo) };
};

/** Nombre para mostrar de una categoria ("pliometria" -> "Pliometría"). */
export const nombreCategoria = (catalogo, categoria) => {
  const conGrupo = (catalogo || []).find(item => item.categoria === categoria && item.grupo);
  if (conGrupo) {
    return conGrupo.grupo;
  }
  return categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : "";
};

export const getCatalogoFallback = (tipo = TIPO_CATALOGO_FUERZA) => filtrarPorTipo({
  catalogo: listadoEjercicios,
  source: "fallback",
  updatedAt: null,
}, tipo);

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

export const refrescarCatalogoRemoto = async (usuarioBackend, { tipo = TIPO_CATALOGO_FUERZA } = {}) => {
  const [groupsBody, exercisesBody] = await Promise.all([
    apiJson(API_ENDPOINTS.muscleGroups),
    apiJson(API_ENDPOINTS.exercises),
  ]);

  const groups = Array.isArray(groupsBody?.data) ? groupsBody.data : [];
  const exercises = Array.isArray(exercisesBody?.data) ? exercisesBody.data : [];
  const allowedOwnerIds = toOwnerIds(usuarioBackend);
  const catalogo = mapearCatalogoRemoto(groups, exercises, allowedOwnerIds);

  if (!catalogo.length) {
    throw new Error("No se encontraron ejercicios remotos para el usuario.");
  }

  // El cache guarda los dos tipos juntos; cada pantalla filtra el suyo.
  const categorias = construirCategorias(catalogo);
  await guardarCatalogoCache({ catalogo, categorias });

  return filtrarPorTipo({
    catalogo,
    source: "remote",
    updatedAt: new Date().toISOString(),
  }, tipo);
};

export const getCatalogoLocalConRefresh = async ({
  usuarioBackend,
  refreshMs = CATALOG_REFRESH_MS,
  tipo = TIPO_CATALOGO_FUERZA,
}) => {
  const cacheCompleto = await cargarCatalogoCache();
  if (!cacheCompleto) {
    return { ...getCatalogoFallback(tipo), needsRefresh: true };
  }
  const cache = filtrarPorTipo(cacheCompleto, tipo);

  const lastUpdateMs = cache.updatedAt ? new Date(cache.updatedAt).getTime() : 0;
  const now = Date.now();
  const needsRefresh = !lastUpdateMs || now - lastUpdateMs >= refreshMs;

  return { ...cache, needsRefresh };
};
