import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, Modal, ScrollView, Alert } from "react-native";
import FormEjercicio from "./formEjercicio";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from "react-redux";
import { agregarRutina, setRutinas } from '../../store/rutinasSlice';
import formatearTiempo from '../../helpers/formatearTiempo';
import { styles } from '../../styles/formRutinaStyles';
import { colores } from "../../styles/colores";
import { maxEscalaFuente } from "../../styles/theme";
import EstadoVacio from "../../components/EstadoVacio";
import PantallaModal from "../../components/PantallaModal";
import { avisoError, avisoExito } from "../../helpers/avisos";

const FormRutina = ({setModalFormRutina, rutinaSeleccionada, setRutinaSeleccionada}) => {

    const dispatch = useDispatch();

    const rutinaInicialRef = useRef("");
    const guardandoRef = useRef(false);

    const [modalFormEjercicio, setModalFormEjercicio] = useState(false);
    const [estaDeshabilitado, setEstaDeshabilitado] = useState(false);
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState();
    const [tiempoEstimado, setTiempoEstimado] = useState(0);

    const [nuevaRutina, setNuevaRutina] = useState({
        id: '',
        nombre:'',
        ejercicios:[],
        estado: 0,
        tiempo: 0
    })

    const generarId = () =>
        Math.random().toString(36).substring(2, 10) +
        Date.now().toString(36);

    useEffect(() => {
        if (nuevaRutina.ejercicios.length > 0) {
            const tiempoTotalSegundos = nuevaRutina.ejercicios.reduce((acumulador, e) => {
            const tiempoSeries = e.ejercicio.tiempoEjecucion * e.series;
            const tiempoDescanso = e.descanso * e.series * 60;
            return acumulador + tiempoSeries + tiempoDescanso;
            }, 0);

            setTiempoEstimado(tiempoTotalSegundos);
        } else {
            setTiempoEstimado(0);
        }
    }, [nuevaRutina.ejercicios]);

    useEffect(()=>{
        setNuevaRutina(previa => ({
            ...previa,
            tiempo: tiempoEstimado
        }));
    },[tiempoEstimado])

    useEffect(() => {
        if (rutinaSeleccionada?.id) {
            const copiaRutina = JSON.parse(JSON.stringify(rutinaSeleccionada));
            setNuevaRutina(copiaRutina);
            rutinaInicialRef.current = JSON.stringify(copiaRutina);
        } else {
            const rutinaNueva = {
                id: generarId(),
                nombre: '',
                ejercicios: [],
                estado: 0,
                tiempo:0
            };
            setNuevaRutina(rutinaNueva);
            rutinaInicialRef.current = JSON.stringify(rutinaNueva);
        }
    }, [rutinaSeleccionada]);

    const cerrarFormulario = () => {
        setNuevaRutina({});
        setModalFormRutina(false);
    };

    const tieneCambiosSinGuardar = () => {
        if (!nuevaRutina || Object.keys(nuevaRutina).length === 0) {
            return false;
        }

        return JSON.stringify(nuevaRutina) !== rutinaInicialRef.current;
    };

    const confirmarSalirSinGuardar = () => {
        if (!tieneCambiosSinGuardar()) {
            cerrarFormulario();
            return;
        }

        Alert.alert(
            "Salir sin guardar",
            "Tenés cambios sin guardar. ¿Querés salir y perderlos?",
            [
                { text: "Seguir editando", style: "cancel" },
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: cerrarFormulario,
                },
            ],
        );
    };

    const handleChange =(campo, valor) =>{
        setNuevaRutina(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const editarEjercicio = (id)=>{
        setEjercicioSeleccionado(id);
        setModalFormEjercicio(true);
    }

    const esEdicion = Boolean(rutinaSeleccionada?.id);
    const sinNombre = !nuevaRutina.nombre?.trim();

    const handleGuardar = () => {
        if (guardandoRef.current) {
            return;
        }
        guardandoRef.current = true;

        if (sinNombre) {
            avisoError('Falta el nombre', 'Ponele un nombre a la rutina para poder guardarla.');
            setEstaDeshabilitado(false);
            guardandoRef.current = false;
            return;
        }

        if (esEdicion) {
            dispatch(setRutinas(nuevaRutina))
            setRutinaSeleccionada?.(nuevaRutina);
        } else {
            dispatch(agregarRutina(nuevaRutina));
        }

        avisoExito(esEdicion ? 'Rutina actualizada' : 'Rutina creada');
        cerrarFormulario();
    };

    const ejercicios = nuevaRutina?.ejercicios || [];

    return (
        <PantallaModal>
            <View style={styles.cuerpo}>
                <View style={styles.botonera}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Volver sin guardar"
                        hitSlop={8}
                        style={({ pressed }) => [styles.botonIcono, pressed && styles.botonIconoPresionado]}
                        onPress={confirmarSalirSinGuardar}
                    >
                        <Icon name="chevron-back-outline" color={colores.textoPrimario} size={30} />
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Guardar la rutina"
                        accessibilityState={{ disabled: estaDeshabilitado || sinNombre }}
                        style={({ pressed }) => [
                            styles.botonGuardar,
                            (estaDeshabilitado || sinNombre || pressed) && styles.botonGuardarDeshabilitado,
                        ]}
                        disabled={estaDeshabilitado || sinNombre}
                        onPress={()=>{
                            setEstaDeshabilitado(true);
                            handleGuardar();
                        }}
                    >
                        <Icon name="checkmark" size={20} color={colores.sobreRelleno} />
                        <Text style={styles.botonGuardarTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                            Guardar
                        </Text>
                    </Pressable>
                </View>

                <Text style={styles.titulo} maxFontSizeMultiplier={maxEscalaFuente}>
                    {esEdicion ? 'Editar rutina' : 'Nueva rutina'}
                </Text>

                <Text style={styles.tiempo} maxFontSizeMultiplier={maxEscalaFuente}>
                    Tiempo estimado: {formatearTiempo(tiempoEstimado)}
                </Text>

                <View style={styles.form}>
                    <Text style={styles.label} maxFontSizeMultiplier={maxEscalaFuente}>
                        Nombre de la rutina
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={nuevaRutina.nombre}
                        onChangeText={(valor)=>{handleChange('nombre',valor)}}
                        placeholder="Ej: Pecho, Piernas, Fullbody..."
                        placeholderTextColor={colores.textoTenue}
                        maxFontSizeMultiplier={maxEscalaFuente}
                    />
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Agregar un ejercicio a la rutina"
                    style={({ pressed }) => [styles.agregarEjercicio, pressed && styles.presionado]}
                    onPress={()=>{
                        setModalFormEjercicio(true)
                    }}
                >
                    <Icon name="add-circle-outline" size={22} color={colores.principal} />
                    <Text style={styles.agregarEjercicioTexto} maxFontSizeMultiplier={maxEscalaFuente}>
                        Agregar ejercicio
                    </Text>
                </Pressable>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {ejercicios.length === 0 ? (
                        <EstadoVacio
                            icono="barbell-outline"
                            titulo="Sin ejercicios"
                            descripcion="Agregá el primer ejercicio para armar la rutina."
                        />
                    ) : (
                        <View style={styles.listaEjercicios}>
                            <Text style={styles.seccionTitulo} maxFontSizeMultiplier={maxEscalaFuente}>
                                {ejercicios.length} {ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}
                            </Text>
                            {ejercicios.map((e) => (
                                <Pressable
                                    key={e.id}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Editar ${e.nombre}`}
                                    style={({ pressed }) => [
                                        styles.ejercicioItem,
                                        pressed && styles.ejercicioItemPresionado,
                                    ]}
                                    onPress={()=>{editarEjercicio(e.id)}}
                                >
                                    <View style={styles.ejercicioDatos}>
                                        <Text
                                            style={styles.ejercicioNombre}
                                            numberOfLines={2}
                                            maxFontSizeMultiplier={maxEscalaFuente}
                                        >
                                            {e.nombre}
                                        </Text>
                                        <Text
                                            style={styles.ejercicioDetalle}
                                            maxFontSizeMultiplier={maxEscalaFuente}
                                        >
                                            {e.series} series · {e.descanso} min de descanso
                                        </Text>
                                    </View>
                                    <Icon name="chevron-forward-outline" size={24} color={colores.textoSecundario} />
                                </Pressable>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>

            <Modal
                visible={modalFormEjercicio}
                animationType="slide"
                statusBarTranslucent
                navigationBarTranslucent
                onRequestClose={() =>{
                    setEjercicioSeleccionado(null);
                    setModalFormEjercicio(false);
                }}
            >
                <FormEjercicio
                    nuevaRutina={nuevaRutina}
                    setNuevaRutina={setNuevaRutina}
                    ejercicioSeleccionado={ejercicioSeleccionado}
                    setEjercicioSeleccionado={setEjercicioSeleccionado}
                    modalFormEjercicio={modalFormEjercicio}
                    setModalFormEjercicio={setModalFormEjercicio}
                />
            </Modal>
        </PantallaModal>

    );
};

export default FormRutina;
