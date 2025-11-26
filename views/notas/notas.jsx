import { View, Text, ScrollView, Pressable, Modal, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/notasStyles";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import NotaDetalle from "./notaDetalle";
import FormNota from './formNota';
import { eliminarNota } from "../../store/notasHistoricasSlice";

const Notas = () => {

    const notas = useSelector(state => state.notasHistoricas.notasHistoricas);
    const dispatch = useDispatch();

    const [notaModal, setNotaModal] = useState(false);
    const [fromModal, setFormModal] = useState(false);
    const [notaSeleccionada, setNotaSeleccionada] = useState();
    
    return (
        <View style={{flex:1}}>
            <ScrollView style={styles.container}>
                {
                    notas?.map(nota => (
                        <View key={nota.id} style={styles.card}>
                            <View>
                                <View style={{alignItems:'flex-end'}}>
                                    <Pressable
                                        onPress={()=>{
                                            Alert.alert( 
                                                'Seleccione una opción',
                                                '',
                                                [
                                                    {
                                                        text:'Cancelar'
                                                    }, 
                                                    {
                                                        text:'Editar', onPress:()=>{
                                                            setNotaSeleccionada(nota);
                                                            setFormModal(true)
                                                        }
                                                    },
                                                    {
                                                        text:'Elimnar', onPress:()=>{
                                                            const idNota = nota.id;
                                                            dispatch(eliminarNota(idNota))
                                                        }
                                                    }    

                                                ]
                                            )
                                        }}
                                    >
                                        <Icon name="ellipsis-vertical-outline"></Icon>
                                    </Pressable>
                                </View>
                                <Text style={styles.cardTitle}>{nota.titulo}</Text>
                                <Text>Última nota:</Text>
                            </View>
                            <Pressable
                                onLongPress={()=>{
                                    setNotaSeleccionada(nota);
                                    setNotaModal(true);
                                }}
                            >

                                {
                                    nota.notas?.length > 0 ? (() => {
                                        const u = nota.notas.at(-1);
                                        return (
                                            <View key={u?.id} style={styles.commentContainer}>
                                                <Text style={styles.commentDate}>{new Date(u?.fecha).toLocaleString()}</Text>
                                                <Text style={styles.commentText}>{u?.nota}</Text>
                                            </View>
                                        );
                                    })() : <Text>¡No ha agregado notas!</Text>
                                }
                            </Pressable>
                        </View>
                    ))
                }
                
                <Modal
                    visible={notaModal}
                    animationType="slide"
                    onRequestClose={() => setNotaModal(false)}
                >
                    <NotaDetalle
                        notaSeleccionada={notaSeleccionada}
                        setNotaModal={setNotaModal}
                    />
                </Modal>

                <Modal
                    visible={fromModal}
                    animationType="slide"
                    onRequestClose={() => setFormModal(false)}
                >
                    <FormNota
                        notaSeleccionada={notaSeleccionada}
                        setFormModal={setFormModal}
                    />
                </Modal>

            </ScrollView>

                <Pressable
                    style={[styles.btn,{position:'absolute', bottom:10, right:10}]}
                    onPress={()=>setFormModal(true)}
                >
                    <Icon name="create-outline" size={30}></Icon>
                </Pressable>    
        </View>
    );
};

export default Notas;
