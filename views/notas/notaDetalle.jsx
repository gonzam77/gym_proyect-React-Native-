import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import styles from "../../styles/notasStyles";
import Icon from 'react-native-vector-icons/Ionicons';
import FormComentario from "./formComentrario";
import { useState } from "react";
import { useSelector } from "react-redux";

const NotaDetalle = ({ nota, setNotaModal })=>{
    
    const notaActualizada = useSelector(state => state.notasHistoricas.notasHistoricas.find(n => n.id === nota.id))
    const listadoNotas = [...(notaActualizada?.notas ?? [])].reverse();

    const [formComentarioModal, setFormComentarioModal] = useState(false);
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState({});
 
    return (
        <View style={{flex:1}}>
            <View>
                <Pressable
                    onPress={()=>setNotaModal(false)}
                    style={{marginTop:20,marginLeft:10,}}
                >
                    <Icon name="chevron-back-outline" color={'#000'} size={25}></Icon>
                    
                </Pressable>
                <Text
                    style={styles.titulo}
                >
                    {nota.titulo}
                </Text>
            </View>
            <ScrollView>

                <View>
                    {
                        listadoNotas?.map((nota) => {
                            const fecha = new Date(nota.fecha).toLocaleString()
                            return (

                                <View key={nota.id} style={styles.commentContainer}>
                                    <Text style={styles.commentDate}>{fecha}</Text>
                                    <Text style={styles.commentText}>{nota.nota}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>

            <Pressable
                style={[styles.btn,{position:'absolute', bottom:20, right:10}]}
                onPress={()=>setFormComentarioModal(true)}
            >
                <Icon name="chatbubble-ellipses-outline" size={25}></Icon>
            </Pressable>

            <Modal
                visible={formComentarioModal}
                animationType="slide"
                onRequestClose={()=>setFormComentarioModal(false)}    
            >
                <FormComentario
                    comentarioSeleccionado={comentarioSeleccionado}
                    setFormComentarioModal={setFormComentarioModal}
                    idNota={nota.id}
                />
            </Modal>

        </View>
    )
}

export default NotaDetalle;