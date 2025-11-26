import { View, Text, ScrollView, Pressable, Modal, Alert } from "react-native";
import styles from "../../styles/notasStyles";
import Icon from 'react-native-vector-icons/Ionicons';
import FormComentario from "./formComentrario";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eliminarComentario } from "../../store/notasHistoricasSlice";

const NotaDetalle = ({ notaSeleccionada, setNotaModal })=>{
    console.log('notaSeleccionada',notaSeleccionada);
    
    
    const notaActualizada = useSelector(state => state.notasHistoricas.notasHistoricas.find(n => n.id === notaSeleccionada?.id))
    const listadoNotas = [...(notaActualizada?.notas ?? [])].reverse();

    const [formComentarioModal, setFormComentarioModal] = useState(false);
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState({});

    const dispatch = useDispatch();
 
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
                    {notaSeleccionada?.titulo}
                </Text>
            </View>
            <ScrollView>

                <View>
                    {
                        listadoNotas?.map((nota) => {
                            const fecha = new Date(nota.fecha).toLocaleString()
                            return (

                                <View key={nota.id} style={styles.commentContainer}>
                                    <View style={{alignItems:'flex-end'}}>
                                        <Pressable
                                            onPress={()=>{
                                                Alert.alert( 
                                                    'Seleccione una opción',
                                                    'Seleccione una opción',
                                                    [
                                                        {
                                                            text:'Cancelar'
                                                        }, 
                                                        {
                                                            text:'Editar', onPress:()=>{
                                                                setComentarioSeleccionado(nota);
                                                                setFormComentarioModal(true);
                                                            }
                                                        },
                                                        {
                                                            text:'Elimnar', onPress:()=>{
                                                                const idNota = notaSeleccionada?.id;
                                                                const idComentario = nota?.id;
                                                                dispatch(eliminarComentario({ idNota, idComentario }))
                                                            }
                                                        }    

                                                    ]
                                                )
                                            }}
                                        >
                                            <Icon name="ellipsis-vertical-outline"></Icon>
                                        </Pressable>
                                    </View>
                                    <View>
                                        <Text style={styles.commentDate}>{fecha}</Text>
                                        <Text style={styles.commentText}>{nota.nota}</Text>
                                    </View>
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
                    idNota={notaSeleccionada.id}
                />
            </Modal>

        </View>
    )
}

export default NotaDetalle;
