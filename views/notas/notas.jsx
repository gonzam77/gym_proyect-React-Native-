import { View, Text, Pressable, Modal, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/notasStyles";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import NotaDetalle from "./notaDetalle";
import FormNota from './formNota';
import HojaAcciones from "../../components/HojaAcciones";
import EstadoVacio from "../../components/EstadoVacio";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import { avisoExito } from "../../helpers/avisos";
import { eliminarNota } from "../../store/notasHistoricasSlice";

const Notas = () => {

    const notas = useSelector(state => state.notasHistoricas.notasHistoricas);
    const dispatch = useDispatch();
    const [notaModal, setNotaModal] = useState(false);
    const [fromModal, setFormModal] = useState(false);
    const [notaSeleccionada, setNotaSeleccionada] = useState({});
    const [menuNota, setMenuNota] = useState(null);

    const nuevaSeccion = () => {
        setNotaSeleccionada({});
        setFormModal(true);
    };

    const confirmarEliminar = (nota) => {
        Alert.alert(
            "Eliminar sección",
            `¿Querés eliminar "${nota.titulo}" y todas sus notas? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        dispatch(eliminarNota(nota.id));
                        avisoExito('Sección eliminada');
                    },
                },
            ],
        );
    };

    const renderNota = ({ item: nota }) => {
        const ultima = nota.notas?.length > 0 ? nota.notas[nota.notas.length - 1] : null;

        return (
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Abrir la sección ${nota.titulo}`}
                style={({ pressed }) => [styles.card, pressed && styles.cardPresionada]}
                onPress={() => {
                    setNotaSeleccionada(nota);
                    setNotaModal(true);
                }}
            >
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
                            {nota.titulo}
                        </Text>
                        <Text style={styles.etiqueta} maxFontSizeMultiplier={maxEscalaFuente}>
                            {nota.notas?.length
                                ? `${nota.notas.length} ${nota.notas.length === 1 ? 'nota' : 'notas'}`
                                : 'Sin notas'}
                        </Text>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Opciones de ${nota.titulo}`}
                        hitSlop={8}
                        style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
                        onPress={(event) => {
                            event.stopPropagation();
                            setMenuNota(nota);
                        }}
                    >
                        <Icon name="ellipsis-vertical" size={20} color={colores.textoSecundario} />
                    </Pressable>
                </View>

                {ultima ? (
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentDate} maxFontSizeMultiplier={maxEscalaFuente}>
                            {new Date(ultima.fecha).toLocaleString()}
                        </Text>
                        <Text
                            numberOfLines={3}
                            ellipsizeMode="tail"
                            style={styles.commentText}
                            maxFontSizeMultiplier={maxEscalaFuente}
                        >
                            {ultima.nota}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.sinNotas} maxFontSizeMultiplier={maxEscalaFuente}>
                        Todavía no agregaste notas acá.
                    </Text>
                )}

                <View style={styles.verMas}>
                    <Text style={styles.verMasTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                        Ver todo
                    </Text>
                    <Icon name="chevron-forward-outline" color={colores.acento} size={16} />
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notas}
                keyExtractor={item => item.id.toString()}
                renderItem={renderNota}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <EstadoVacio
                        icono="create-outline"
                        titulo="Todavía no tenés notas"
                        descripcion="Creá una sección para ir anotando pesos, sensaciones o lo que quieras seguir."
                        textoAccion="Crear una sección"
                        onAccion={nuevaSeccion}
                    />
                )}
            />

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Crear una sección de notas"
                style={({ pressed }) => [styles.btn, { bottom: 20 }, pressed && styles.btnPresionado]}
                onPress={nuevaSeccion}
            >
                <Icon name="pencil" size={26} color={colores.sobreRelleno} />
            </Pressable>

            <HojaAcciones
                visible={Boolean(menuNota)}
                titulo={menuNota?.titulo}
                onClose={() => setMenuNota(null)}
                opciones={[
                    {
                        texto: 'Editar título',
                        icono: 'pencil-outline',
                        onPress: () => {
                            setNotaSeleccionada(menuNota);
                            setFormModal(true);
                        },
                    },
                    {
                        texto: 'Eliminar sección',
                        icono: 'trash-outline',
                        destructivo: true,
                        onPress: () => confirmarEliminar(menuNota),
                    },
                ]}
            />

            <Modal
                visible={notaModal}
                animationType="slide"
                statusBarTranslucent
                navigationBarTranslucent
                onRequestClose={() => {
                    setNotaModal(false);
                    setNotaSeleccionada({});
                }}
            >
                <NotaDetalle
                    notaSeleccionada={notaSeleccionada}
                    setNotaSeleccionada={setNotaSeleccionada}
                    setNotaModal={setNotaModal}
                />
            </Modal>

            <Modal
                visible={fromModal}
                animationType="slide"
                statusBarTranslucent
                navigationBarTranslucent
                onRequestClose={() => {
                    setFormModal(false);
                    setNotaSeleccionada({});
                }}
            >
                <FormNota
                    notaSeleccionada={notaSeleccionada}
                    setNotaSeleccionada={setNotaSeleccionada}
                    setFormModal={setFormModal}
                />
            </Modal>
        </View>
    );
};

export default Notas;
