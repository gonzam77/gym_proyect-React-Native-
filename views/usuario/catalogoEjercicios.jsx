import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import {
  CATALOG_REFRESH_MS,
  getCatalogoLocalConRefresh,
  refrescarCatalogoRemoto,
} from "../../helpers/catalogoEjercicios";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import styles from "../../styles/catalogoStyles";
import Esqueleto from "../../components/Esqueleto";

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
  const [abiertas, setAbiertas] = useState({});

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
      setError(e?.message || "No se pudo actualizar el catálogo.");
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

  const alternar = categoria => {
    setAbiertas(previas => ({ ...previas, [categoria]: !previas[categoria] }));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.tarjeta}>
        <Text style={styles.tituloTarjeta} maxFontSizeMultiplier={maxEscalaFuente}>
          Catálogo de ejercicios
        </Text>
        <Text style={styles.dato} maxFontSizeMultiplier={maxEscalaFuente}>
          Última actualización: {formatearFecha(updatedAt)}
        </Text>
        <Text style={styles.dato} maxFontSizeMultiplier={maxEscalaFuente}>
          Se actualiza solo cada {Math.floor(CATALOG_REFRESH_MS / (60 * 60 * 1000))} horas
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refrescar el catálogo ahora"
          accessibilityState={{ disabled: refreshing, busy: refreshing }}
          onPress={refrescarManual}
          style={({ pressed }) => [
            styles.boton,
            (refreshing || pressed) && styles.botonPresionado,
          ]}
          disabled={refreshing}
        >
          <Icon name="refresh-outline" size={18} color={colores.sobreRelleno} />
          <Text style={styles.botonTexto} maxFontSizeMultiplier={maxEscalaFuente}>
            {refreshing ? "Actualizando..." : "Refrescar ahora"}
          </Text>
        </Pressable>

        {error ? (
          <View style={styles.errorCaja}>
            <Icon name="alert-circle-outline" size={20} color={colores.peligro} />
            <Text style={styles.errorTexto} maxFontSizeMultiplier={maxEscalaFuente}>{error}</Text>
          </View>
        ) : null}
      </View>

      {cargando ? (
        <Esqueleto cantidad={4} />
      ) : (
        ejerciciosPorCategoria.map(({ categoria, ejercicios }) => {
          const abierta = Boolean(abiertas[categoria]);

          return (
            <View key={categoria} style={styles.categoria}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${categoria}, ${ejercicios.length} ejercicios`}
                accessibilityState={{ expanded: abierta }}
                style={({ pressed }) => [
                  styles.categoriaEncabezado,
                  pressed && styles.categoriaEncabezadoPresionado,
                ]}
                onPress={() => alternar(categoria)}
              >
                <Text style={styles.categoriaNombre} maxFontSizeMultiplier={maxEscalaFuente}>
                  {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </Text>
                <Text style={styles.contador} maxFontSizeMultiplier={maxEscalaFuente}>
                  {ejercicios.length}
                </Text>
                <Icon
                  name={abierta ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colores.textoSecundario}
                />
              </Pressable>

              {abierta ? (
                <View style={styles.listaEjercicios}>
                  {ejercicios.map(ej => (
                    <View key={ej.idEjercicio} style={styles.ejercicio}>
                      <Icon name="ellipse" size={5} color={colores.textoTenue} />
                      <Text style={styles.ejercicioNombre} maxFontSizeMultiplier={maxEscalaFuente}>
                        {ej.nombre}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default CatalogoEjercicios;
