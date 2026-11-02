import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import MisRutinas from "./misRutinas";
import RutinasAsignadas from "./rutinasAsignadas";
import MisFuncionales from "../funcional/misFuncionales";
import { TIPO_FUERZA, TIPO_FUNCIONAL, esDelTipo } from "../../helpers/funcional";
import { colores } from "../../styles/colores";
import { espaciado, maxEscalaFuente, radios, tipografia, toqueMinimo } from "../../styles/theme";

const SEGMENTOS = {
  [TIPO_FUERZA]: [
    { clave: 'mias', texto: 'Mis rutinas' },
    { clave: 'asignadas', texto: 'Asignadas' },
  ],
  [TIPO_FUNCIONAL]: [
    { clave: 'mias', texto: 'Mis funcionales' },
    { clave: 'asignados', texto: 'Asignados' },
  ],
};

/**
 * Pestaña "Rutinas": junta Mis rutinas y las asignadas por el coach, con un
 * selector arriba. Las dos vistas quedan montadas (la de asignadas recien la
 * primera vez que se abre) para no perder el scroll ni volver a pedir al
 * servidor cada vez que se cambia de segmento.
 *
 * La pestaña Funcional es esta misma pantalla con tipo="funcional": cada una
 * muestra solo las rutinas de su tipo, tanto las propias como las asignadas.
 */
const Rutinas = ({ tipo = TIPO_FUERZA }) => {
  const [segmento, setSegmento] = useState('mias');
  const [asignadasMontada, setAsignadasMontada] = useState(false);

  // Rutinas que el coach modifico y todavia no se actualizaron en el telefono.
  // Cada pestaña cuenta solo las de su tipo.
  const cambiosCoach = useSelector(state =>
    state.rutinas.rutinas.filter(r => r.tieneCambiosAsignados && esDelTipo(r, tipo)).length
  );

  const elegir = clave => {
    if (clave !== 'mias') setAsignadasMontada(true);
    setSegmento(clave);
  };

  const funcional = tipo === TIPO_FUNCIONAL;
  const claveAsignadas = SEGMENTOS[tipo][1].clave;

  return (
    <SafeAreaView style={styles.fondo} edges={['top']}>
      <View style={styles.selector} accessibilityRole="tablist">
        {SEGMENTOS[tipo].map(({ clave, texto }) => {
          const activo = segmento === clave;
          return (
            <Pressable
              key={clave}
              accessibilityRole="tab"
              accessibilityState={{ selected: activo }}
              accessibilityLabel={clave === claveAsignadas && cambiosCoach ? `${texto}, ${cambiosCoach} con cambios del coach` : texto}
              style={({ pressed }) => [styles.opcion, activo && styles.opcionActiva, pressed && styles.presionado]}
              onPress={() => elegir(clave)}
            >
              <Text style={[styles.opcionTexto, activo && styles.opcionTextoActiva]} maxFontSizeMultiplier={maxEscalaFuente}>
                {texto}
              </Text>
              {clave === claveAsignadas && cambiosCoach > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto} maxFontSizeMultiplier={1.2}>{cambiosCoach}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.contenido, segmento !== 'mias' && styles.oculto]}>
        {funcional ? (
          <MisFuncionales activo={segmento === 'mias'} />
        ) : (
          <MisRutinas embebido activo={segmento === 'mias'} />
        )}
      </View>
      {asignadasMontada ? (
        <View style={[styles.contenido, segmento !== claveAsignadas && styles.oculto]}>
          <RutinasAsignadas embebido tipo={tipo} />
        </View>
      ) : null}

    </SafeAreaView>
  );
};

export default Rutinas;

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  selector: {
    flexDirection: "row",
    marginHorizontal: espaciado.xl,
    marginTop: espaciado.sm,
    marginBottom: espaciado.xs,
    padding: 4,
    borderRadius: radios.completo,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.bordeSuave,
  },
  opcion: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espaciado.xs,
    minHeight: toqueMinimo - 4,
    borderRadius: radios.completo,
  },
  opcionActiva: {
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  presionado: {
    opacity: 0.75,
  },
  opcionTexto: {
    ...tipografia.auxiliar,
    color: colores.textoSecundario,
  },
  opcionTextoActiva: {
    color: colores.textoPrimario,
  },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: colores.acento,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTexto: {
    ...tipografia.micro,
    fontSize: 11,
    color: colores.sobreAcento,
  },
  contenido: {
    flex: 1,
  },
  oculto: {
    display: "none",
  },
});
