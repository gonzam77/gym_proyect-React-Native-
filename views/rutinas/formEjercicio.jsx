import { useEffect, useState } from "react";
import { Text, TextInput, View, ScrollView, Alert, Pressable } from "react-native";
import listadoEjercicios from "../../helpers/ejercicios";
import { Picker } from "@react-native-picker/picker";
import { styles } from '../../styles/formEjercicioStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { colores } from "../../styles/colores";
import { useSelector } from "react-redux";

const MUSCLE_GROUPS_URL = "https://rutina360-server.onrender.com/muscleGroup";
const EXERCISES_URL = "https://rutina360-server.onrender.com/ejercice";
const DEFAULT_EXERCISE_SECONDS = 40;

const normalizarTexto = texto =>
  texto
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
 
const FormEjercicio = ({ nuevaRutina, setNuevaRutina, setModalFormEjercicio, ejercicioSeleccionado, setEjercicioSeleccionado}) => {
  const sesion = useSelector(state => state.usuario.sesion);
  const usuarioBackend = sesion?.user;

  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const [catalogoEjercicios, setCatalogoEjercicios] = useState(listadoEjercicios);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errores, setErrores] = useState("");

  const [ejercicioNuevo, setEjercicioNuevo] = useState({
    id: '',
    ejercicio:{},
    series: "",
    descanso: "",
    seriesRealizadas:0,
    nota:''
  });

  useEffect(() => {
    const allowedOwnerIds = Array.from(new Set(
      [1, usuarioBackend?.id, usuarioBackend?.idAdminOwner, usuarioBackend?.adminOwner?.id]
        .map(id => Number(id))
        .filter(Number.isFinite)
    ));

    const aplicarFallback = () => {
      setCatalogoEjercicios(listadoEjercicios);
      setCategorias(
        Array.from(new Set(listadoEjercicios.map(item => item.categoria))).sort((a, b) => a.localeCompare(b))
      );
    };

    const fetchCatalogo = async () => {
      try {
        const [resGroups, resExercises] = await Promise.all([
          fetch(MUSCLE_GROUPS_URL),
          fetch(EXERCISES_URL),
        ]);

        let groupsBody = {};
        let exercisesBody = {};

        try {
          groupsBody = await resGroups.json();
        } catch {
          groupsBody = {};
        }

        try {
          exercisesBody = await resExercises.json();
        } catch {
          exercisesBody = {};
        }

        if (!resGroups.ok || !resExercises.ok) {
          throw new Error("No se pudo cargar el catalogo.");
        }

        const groups = Array.isArray(groupsBody?.data) ? groupsBody.data : [];
        const exercises = Array.isArray(exercisesBody?.data) ? exercisesBody.data : [];

        const groupsMap = new Map(
          groups.map(group => [
            group.id,
            {
              ...group,
              categoriaNormalizada: normalizarTexto(group.name),
            },
          ])
        );

        const ejerciciosConOwnerValido = exercises.filter(item => {
          const ownerId = Number(item?.idOwner);
          return Number.isFinite(ownerId) && allowedOwnerIds.includes(ownerId);
        });

        const catalogoNormalizado = ejerciciosConOwnerValido.map(item => {
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

        const categoriasUnicas = Array.from(
          new Set(
            catalogoNormalizado
              .map(item => item.categoria)
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b));

        if (!catalogoNormalizado.length) {
          aplicarFallback();
          return;
        }

        setCatalogoEjercicios(catalogoNormalizado);
        setCategorias(categoriasUnicas);
      } catch {
        aplicarFallback();
      }
    };

    fetchCatalogo();
  }, [usuarioBackend?.adminOwner?.id, usuarioBackend?.id, usuarioBackend?.idAdminOwner]);

  useEffect(() => {
    if (ejercicioSeleccionado) {
      const seleccionado = nuevaRutina.ejercicios.find(e => e.id === ejercicioSeleccionado);
      if (seleccionado) {
        setEjercicioNuevo(JSON.parse(JSON.stringify(seleccionado)));
        const categoria = catalogoEjercicios.find(e => e.idEjercicio === seleccionado.ejercicio.idEjercicio)?.categoria;
        if (categoria) {
          setSelectedCategory(categoria);
        }
      }
    }
  },[catalogoEjercicios, ejercicioSeleccionado, nuevaRutina.ejercicios]);

  useEffect(() => {
    if (selectedCategory) {
      setEjerciciosFiltrados(
        catalogoEjercicios.filter(e => e.categoria === selectedCategory)
      );
    } else {
      setEjerciciosFiltrados([]);
    }
  }, [catalogoEjercicios, selectedCategory]);

  const eliminarEjercicio = ()=>{
    Alert.alert(
      'Eliminar',
      'Desea eliminar el ejercicio?',
      [{text:'Cancelar'}, {text:'Ok, Elimnar', onPress:()=>{
        setNuevaRutina({
          ...nuevaRutina,
          ejercicios: nuevaRutina.ejercicios.filter(e => e.id !== ejercicioSeleccionado)
        });

        setEjercicioSeleccionado(null); 
        setModalFormEjercicio(false);
      }}]
    )
        
  };

  const validarFormulario = () => {   
    if (!selectedCategory) return "Debe seleccionar una categoria.";
    if (!ejercicioNuevo.ejercicio?.idEjercicio) return "Debe seleccionar un ejercicio.";
    if (!ejercicioNuevo.series || ejercicioNuevo.series <= 0 ||
        !ejercicioNuevo.descanso || ejercicioNuevo.descanso <= 0)
      return "Todos los campos deben ser mayores a cero.";
    return "";
  };

  const handleChange = (campo, valor) => {
    if (campo === 'nota') {
      setEjercicioNuevo(prev => ({
            ...prev,
            [campo]: valor
      }));
    } else {
      setEjercicioNuevo(prev => ({
        ...prev,
        [campo]: valor === "" ? "" : Number(valor),
      }))
    };
  };

  const generarId = () =>
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36);

  const handleGuardar = () => {
    const error = validarFormulario();
    if (error) {
      setErrores(error);
      alert(error);
      return;
    }
    
    if(ejercicioSeleccionado){
      setNuevaRutina({
        ...nuevaRutina,
        ejercicios: nuevaRutina.ejercicios.map(e => e.id !== ejercicioSeleccionado ? e : ejercicioNuevo)
      })
    } else {
      setNuevaRutina({
        ...nuevaRutina,
        ejercicios: [
          ...nuevaRutina.ejercicios,
          { ...ejercicioNuevo, id: generarId() }
        ],
      });

    }   
    setModalFormEjercicio(false);
    setEjercicioSeleccionado(null)
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.botonera}>
        <Pressable
          onPress={() => {
            setEjercicioSeleccionado(null);
            setModalFormEjercicio(false);
          }}
        >
          
          <Icon name="chevron-back-outline" color={'#fff'} size={35} />
        </Pressable>

        {
          ejercicioSeleccionado ?
            <Pressable
              onPress={() => {eliminarEjercicio()}}
              style={{borderRadius:8, backgroundColor:'#862b2bff'}}
            >
              <Text style={{color:'#fff', fontSize:16, fontWeight:'900', padding:10}}>Eliminar</Text>
            </Pressable>
          :null
        }
        <Pressable style={{borderRadius:8, backgroundColor:colores.verdeOpaco}} onPress={handleGuardar}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'900', padding:10}}>Guardar</Text>
        </Pressable>
        
      </View>
      <Text style={styles.titulo}>Personalizar Ejercicio</Text>
      <View style={styles.seccion}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCategory}
            dropdownIconColor="#fff"
            onValueChange={valor => setSelectedCategory(valor)}
            style={styles.picker}
          >
            <Picker.Item label="--Seleccione Categoria--" value="" />
            {categorias.map(categoria => (
              <Picker.Item
                key={categoria}
                label={categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                value={categoria}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.seccion}>
        <Text style={styles.label}>Ejercicio</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={ejercicioNuevo.ejercicio?.nombre || ""}
            dropdownIconColor="#fff"
            onValueChange={valor => {
              const ejercicioSeleccionado = ejerciciosFiltrados.find(e => e.nombre === valor);
              if (ejercicioSeleccionado) {
                setEjercicioNuevo(prev => ({
                  ...prev,
                  ejercicio: ejercicioSeleccionado,
                  nombre: ejercicioSeleccionado.nombre
                }));
              } else {
                setEjercicioNuevo(prev => ({
                  ...prev,
                  id: "",
                  nombre: ""
                }));
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="--Seleccione Ejercicio--" value="" />
            {ejerciciosFiltrados
              ?.filter(e => e.categoria === selectedCategory)
              ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
              ?.map(ej => {
                return(
                <Picker.Item key={ej.idEjercicio} label={ej.nombre} value={ej.nombre} />
                )
            })}
          </Picker>
        </View>
      </View>
      <View style={styles.seccion}>
        <Text style={styles.label}>Series</Text>
        <TextInput
          value={ejercicioNuevo.series.toString()}
          style={styles.input}
          keyboardType="numeric"
          onChangeText={v => handleChange("series", v)}
          />
        <Text style={styles.label}>Descanso</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            style={styles.picker}
            selectedValue={ejercicioNuevo.descanso.toString()}
            dropdownIconColor="#fff"
            onValueChange={v => handleChange("descanso", v)}
          >
            <Picker.Item label="--Minutos de descanso--" value=''></Picker.Item>
            <Picker.Item label="1 Min" value='1'></Picker.Item>
            <Picker.Item label="2 Min" value='2'></Picker.Item>
            <Picker.Item label="3 Min" value='3'></Picker.Item>
            <Picker.Item label="4 Min" value='4'></Picker.Item>
            <Picker.Item label="5 Min" value='5'></Picker.Item>
            <Picker.Item label="6 Min" value='6'></Picker.Item>
            <Picker.Item label="7 Min" value='7'></Picker.Item>
            <Picker.Item label="8 Min" value='8'></Picker.Item>
            <Picker.Item label="9 Min" value='9'></Picker.Item>
            <Picker.Item label="10 Min" value='10'></Picker.Item>
          </Picker>
        </View>
        <Text style={styles.label}>Nota</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Peso estimado, repeticiones estimadas"
          value={ejercicioNuevo.nota}
          onChangeText={(valor)=>{handleChange('nota',valor)}}
          style={[styles.input,{minHeight:80}]}
          placeholderTextColor='#888'
        ></TextInput>
      </View>
      {errores !== "" && <Text style={styles.error}>{errores}</Text>}
    </ScrollView>
  );
};

export default FormEjercicio;
