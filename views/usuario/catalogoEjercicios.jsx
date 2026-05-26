import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  CATALOG_REFRESH_MS,
  getCatalogoLocalConRefresh,
  refrescarCatalogoRemoto,
} from "../../helpers/catalogoEjercicios";
import { colores } from "../../styles/colores";

const formatearFecha = (valor) => {
  if (!valor) return "Sin registros";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Sin registros";
  return fecha.toLocaleString();
};

const CatalogoEjercicios = () => {
  const sesion = useSelector(state => state.usuario.sesion);
  const usuarioBackend = sesion?.user;
  const [catalogo, setCatalogo] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const cargarLocal = useCallback(async () => {
    setError("");
    const local = await getCatalogoLocalConRefresh({ usuarioBackend, refreshMs: CATALOG_REFRESH_MS });
    setCatalogo(local.catalogo);
    setCategorias(local.categorias);
    setUpdatedAt(local.updatedAt);
    return local;
  }, [usuarioBackend]);

  const refrescarManual = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const remoto = await refrescarCatalogoRemoto(usuarioBackend);
      setCatalogo(remoto.catalogo);
      setCategorias(remoto.categorias);
      setUpdatedAt(remoto.updatedAt);
    } catch (e) {
      setError(e?.message || "No se pudo actualizar el catalogo.");
    } finally {
      setRefreshing(false);
    }
  }, [usuarioBackend]);

  useEffect(() => {
    const init = async () => {
      setCargando(true);
      const local = await cargarLocal();
      setCargando(false);
      if (local.needsRefresh) {
        refrescarManual();
      }
    };
    init();
  }, [cargarLocal, refrescarManual]);

  const ejerciciosPorCategoria = useMemo(
    () =>
      categorias.map(categoria => ({
        categoria,
        ejercicios: catalogo
          .filter(item => item.categoria === categoria)
          .sort((a, b) => a.nombre.localeCompare(b.nombre)),
      })),
    [catalogo, categorias]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colores.azulProfundo }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: "#ffffff", borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <Text style={{ color: "#111", fontSize: 18, fontWeight: "800" }}>Catalogo de ejercicios</Text>
        <Text style={{ color: "#555", marginTop: 6 }}>
          Ultima actualizacion: {formatearFecha(updatedAt)}
        </Text>
        <Text style={{ color: "#555", marginTop: 2 }}>
          Refresh automatico: cada {Math.floor(CATALOG_REFRESH_MS / (60 * 60 * 1000))} horas
        </Text>
        <Pressable
          onPress={refrescarManual}
          style={{
            marginTop: 12,
            backgroundColor: colores.verdeOpaco,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
            opacity: refreshing ? 0.7 : 1,
          }}
          disabled={refreshing}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            {refreshing ? "Actualizando..." : "Refrescar ahora"}
          </Text>
        </Pressable>
        {error ? <Text style={{ color: "#b00020", marginTop: 10 }}>{error}</Text> : null}
      </View>

      {cargando ? (
        <ActivityIndicator color={colores.verdeOpaco} size="large" />
      ) : (
        ejerciciosPorCategoria.map(({ categoria, ejercicios }) => (
          <View key={categoria} style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "800", fontSize: 16, color: "#111", marginBottom: 8 }}>
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </Text>
            {ejercicios.map(ej => (
              <Text key={ej.idEjercicio} style={{ color: "#333", marginBottom: 5 }}>
                - {ej.nombre}
              </Text>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default CatalogoEjercicios;
