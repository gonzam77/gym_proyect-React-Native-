import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FormUsuario from "./formUsuario";
import { useSelector } from "react-redux";
import styles from "../../styles/perfilStyles";

const Perfil = () => {

    const [formModal, setFormModal] = useState(false);

    const usuario = useSelector(state => state.usuario.usuario);
    console.log('usuario', usuario);
    

  return (
    <View style={styles.container}>

        <View style={styles.card}>
            <Pressable
                onPress={()=>setFormModal(true)}
            >

                <View style={{alignSelf:'flex-end'}}>
                    <Icon name="pencil-outline" size={25}></Icon>
                </View>
            </Pressable>

            {/* Foto o icono */}
            <View style={styles.header}>
                <Icon name="person-circle-outline" size={80} color="#4A90E2" />
                <Text style={styles.nombre}>{usuario.nombre || "Usuario"}</Text>
            </View>

            {/* Datos */}
            <View style={styles.row}>
                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.value}>{usuario.correo || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Edad:</Text>
                <Text style={styles.value}>{usuario.edad || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Altura:</Text>
                <Text style={styles.value}>{usuario.altura ? usuario.altura + " cm" : "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Peso:</Text>
                <Text style={styles.value}>{usuario.peso ? usuario.peso + " kg" : "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Género:</Text>
                <Text style={styles.value}>{usuario.genero || "-"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Disponibilidad:</Text>
                <Text style={styles.value}>{usuario.disponibilidad || "-"}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.label}>Objetivos:</Text>
                <Text style={styles.objetivos}>{usuario.objetivos || "-"}</Text>
            </View>
        </View>

        <Modal
            visible={formModal}
            animationType="slide"
            onRequestClose={() => setFormModal(false)}
        >
            <FormUsuario
                usuario={usuario}
                setFormModal={setFormModal}
            />
        </Modal>
    </View>
  );
};

export default Perfil;
