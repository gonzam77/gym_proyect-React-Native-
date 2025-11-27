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
    const copiaNotas = JSON.parse(JSON.stringify(notas));
    const dispatch = useDispatch();
    const [notaModal, setNotaModal] = useState(false);
    const [fromModal, setFormModal] = useState(false);
    const [notaSeleccionada, setNotaSeleccionada] = useState({});
    
    return (
        <View style={{flex:1}}>
            <ScrollView style={styles.container}>
                {
                    copiaNotas?.map(nota => (
                        <View key={nota.id} style={styles.card}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <View>
                                    <Text style={styles.cardTitle}>{nota.titulo}</Text>
                                    <Text>Última nota:</Text>
                                </View>
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
                                                        text:'Eliminar', onPress:()=>{
                                                            const idNota = nota.id;
                                                            dispatch(eliminarNota(idNota))
                                                        }
                                                    }    

                                                ]
                                            )
                                        }}
                                    >
                                        <Icon name="ellipsis-vertical-outline" size={20}></Icon>
                                    </Pressable>
                                </View>
                                
                            </View>
                            <Pressable
                                onPress={()=>{
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
                                <View style={{alignSelf:'flex-end', margin:5}}>
                                    <Icon name="chevron-forward-outline" color={'#000'} size={20}></Icon>
                                </View>
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
                        setNotaSeleccionada={setNotaSeleccionada}
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
                        setNotaSeleccionada={setNotaSeleccionada}
                        setFormModal={setFormModal}
                    />
                </Modal>

            </ScrollView>

                <Pressable
                    style={[styles.btn, {position:'absolute', bottom:10, right:20}]}
                    onPress={()=>setFormModal(true)}
                >
                    <Icon name="create-outline" size={30} color={'#fff'}></Icon>
                </Pressable>    
        </View>
    );
};

export default Notas;
