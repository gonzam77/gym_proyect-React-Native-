import { View, Text, Pressable, Modal, Alert, FlatList } from "react-native";
import styles from "../../styles/notasStyles";
import Icon from 'react-native-vector-icons/Ionicons';
import FormComentario from "./formComentrario";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eliminarComentario } from "../../store/notasHistoricasSlice";
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import HojaAcciones from "../../components/HojaAcciones";
import EstadoVacio from "../../components/EstadoVacio";
import PantallaModal from "../../components/PantallaModal";
import { avisoExito } from "../../helpers/avisos";

const NotaDetalle = ({ notaSeleccionada, setNotaSeleccionada, setNotaModal })=>{

    const notaActualizada = useSelector(state => state.notasHistoricas.notasHistoricas.find(n => n.id === notaSeleccionada?.id))
    const copiaNotaActualizada = notaActualizada
        ? JSON.parse(JSON.stringify(notaActualizada))
        : null;
    const listadoNotas = copiaNotaActualizada?.notas?.reverse() || [];

    const [formComentarioModal, setFormComentarioModal] = useState(false);
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState({});
    const [menuComentario, setMenuComentario] = useState(null);

    const dispatch = useDispatch();

    const nuevoComentario = () => {
        setComentarioSeleccionado({});
        setFormComentarioModal(true);
    };

    const confirmarEliminar = (comentario) => {
        Alert.alert(
            "Eliminar nota",
            "¿Querés eliminar esta nota? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        dispatch(eliminarComentario({
                            idNota: notaSeleccionada?.id,
                            idComentario: comentario?.id,
                        }));
                        avisoExito('Nota eliminada');
                    },
                },
            ],
        );
    };

    const renderComentario = ({ item: nota }) => (
        <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
                <Text style={styles.commentDate} maxFontSizeMultiplier={maxEscalaFuente}>
                    {new Date(nota.fecha).toLocaleString()}
                </Text>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Opciones de la nota"
                    hitSlop={8}
                    style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
                    onPress={() => setMenuComentario(nota)}
                >
                    <Icon name="ellipsis-vertical" size={20} color={colores.textoSecundario} />
                </Pressable>
            </View>
            <Text style={styles.commentText} maxFontSizeMultiplier={maxEscalaFuente}>
                {nota.nota}
            </Text>
        </View>
    );

    return (
        <PantallaModal>
            <View style={styles.encabezado}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Volver a mis notas"
                    hitSlop={8}
                    style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
                    onPress={()=>{
                        setNotaModal(false);
                        setNotaSeleccionada({});
                    }}
                >
                    <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
                </Pressable>
                <Text style={styles.titulo} numberOfLines={2} maxFontSizeMultiplier={maxEscalaFuente}>
                    {notaSeleccionada?.titulo}
                </Text>
            </View>

            <FlatList
                data={listadoNotas}
                keyExtractor={item => item.id.toString()}
                renderItem={renderComentario}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <EstadoVacio
                        icono="chatbubble-ellipses-outline"
                        titulo="Esta sección está vacía"
                        descripcion="Agregá la primera nota para empezar a llevar el registro."
                        textoAccion="Agregar una nota"
                        onAccion={nuevoComentario}
                    />
                )}
            />

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Agregar una nota"
                style={({ pressed }) => [styles.btn, { bottom: 20 }, pressed && styles.btnPresionado]}
                onPress={nuevoComentario}
            >
                <Icon name="chatbubble-ellipses-outline" size={26} color={colores.sobreRelleno} />
            </Pressable>

            <HojaAcciones
                visible={Boolean(menuComentario)}
                onClose={() => setMenuComentario(null)}
                opciones={[
                    {
                        texto: 'Editar nota',
                        icono: 'pencil-outline',
                        onPress: () => {
                            setComentarioSeleccionado(menuComentario);
                            setFormComentarioModal(true);
                        },
                    },
                    {
                        texto: 'Eliminar nota',
                        icono: 'trash-outline',
                        destructivo: true,
                        onPress: () => confirmarEliminar(menuComentario),
                    },
                ]}
            />

            <Modal
                visible={formComentarioModal}
                animationType="slide"
                statusBarTranslucent
                navigationBarTranslucent
                onRequestClose={()=>{
                    setFormComentarioModal(false);
                    setComentarioSeleccionado({});
                }}
            >
                <FormComentario
                    comentarioSeleccionado={comentarioSeleccionado}
                    setComentarioSeleccionado={setComentarioSeleccionado}
                    setFormComentarioModal={setFormComentarioModal}
                    idNota={notaSeleccionada.id}
                />
            </Modal>

        </PantallaModal>
    )
}

export default NotaDetalle;
