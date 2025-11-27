import { useEffect, useState } from "react";
import { Text, TextInput, View, ScrollView, Alert } from "react-native";
import listadoEjercicios from "../../helpers/ejercicios";
import { Picker } from "@react-native-picker/picker";
import { styles } from '../../styles/formEjercicioStyles';
import { BotonBorrar, BotonVolver, BotonGuardar } from "../../components/botones/botones";
import uuid from 'react-native-uuid';
 
const FormEjercicio = ({nuevaRutina, setNuevaRutina, setModalFormEjercicio, ejercicioSeleccionado, setEjercicioSeleccionado}) => {

  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errores, setErrores] = useState("");

  const [ejercicioNuevo, setEjercicioNuevo] = useState({
    id: '',
    ejercicio:{},
    series: "",
    descanso: "",
    seriesRealizadas:0
  });

  useEffect(() => {
    if (ejercicioSeleccionado) {
      const seleccionado = nuevaRutina.ejercicios.find(e => e.id === ejercicioSeleccionado);
      if (seleccionado) {
        setEjercicioNuevo(JSON.parse(JSON.stringify(seleccionado)));
        const categoria = listadoEjercicios.find(e => e.idEjercicio === seleccionado.ejercicio.idEjercicio
        )?.categoria;
        if (categoria) {
          setSelectedCategory(categoria);
        }
      }
    }
  },[ejercicioSeleccionado]);

  useEffect(() => {
    if (selectedCategory) {
      setEjerciciosFiltrados(
        listadoEjercicios.filter(e => e.categoria === selectedCategory)
      );
    } else {
      setEjerciciosFiltrados([]);
    }
  }, [selectedCategory]);

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
    if (!selectedCategory) return "Debe seleccionar una categoría.";
    if (!ejercicioNuevo.ejercicio?.idEjercicio) return "Debe seleccionar un ejercicio.";
    if (!ejercicioNuevo.series || ejercicioNuevo.series <= 0 ||
        !ejercicioNuevo.descanso || ejercicioNuevo.descanso <= 0)
      return "Todos los campos deben ser mayores a cero.";
    return "";
  };

  const handleChange = (campo, valor) => {
      setEjercicioNuevo(prev => ({
            ...prev,
            [campo]: valor === "" ? "" : Number(valor),
      }));
  };

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
          { ...ejercicioNuevo, id: uuid.v4() }
        ],
      });

    }   
    setModalFormEjercicio(false);
    setEjercicioSeleccionado(null)
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.botonera}>
        <BotonVolver
          onPress={()=>{
            setEjercicioSeleccionado(null);
            setModalFormEjercicio(false);
          }}
        />
        {
          ejercicioSeleccionado ?
            <BotonBorrar
              onPress={()=>{
              eliminarEjercicio();
              }}
            />
          :null
        }
        <BotonGuardar
          onPress={handleGuardar}
        />
      </View>
      <Text style={styles.titulo}>Personalizar Ejercicio</Text>
      <View style={styles.seccion}>
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCategory}
            dropdownIconColor="#fff"
            onValueChange={valor => setSelectedCategory(valor)}
            style={styles.picker}
          >
            <Picker.Item label="--Seleccione Categoria--" value="" />
           {[
                "Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps", "Antebrazos", "Cuádriceps",
                "Isquiotibiales", "Glúteos", "Aductores", "Gemelos", "Abdominales", "Lumbares"
            ].map(c => {
                const valorSinAcentos = c
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""); 
                return (
                    <Picker.Item key={valorSinAcentos} label={c} value={valorSinAcentos} />
                );
            })}
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
      </View>
      {errores !== "" && <Text style={styles.error}>{errores}</Text>}
    </ScrollView>
  );
};

export default FormEjercicio;
