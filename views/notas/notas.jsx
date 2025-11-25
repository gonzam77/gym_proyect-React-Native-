import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { useSelector } from "react-redux";
import styles from "../../styles/notasStyles";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import NotaDetalle from "./notaDetalle";
import FormNota from './formNota';

const Notas = () => {

    const notas = useSelector(state => state.notasHistoricas.notasHistoricas);

    const [notaModal, setNotaModal] = useState(false);
    const [fromModal, setFormModal] = useState(false);
    const [notaSeleccionada, setNotaSeleccionada] = useState();

    return (
        <View style={{flex:1}}>
            <ScrollView style={styles.container}>
                {
                    notas?.map(nota => (
                        <View key={nota.id} style={styles.card}>
                            <Pressable
                                onLongPress={()=>{
                                    setNotaSeleccionada(nota);
                                    setNotaModal(true);
                                }}
                            >
                                <Text style={styles.cardTitle}>{nota.titulo}</Text>
                                <Text>Última nota:</Text>

                                {
                                    nota.notas?.length > 0 ? (() => {
                                        const u = nota.notas.at(-1);
                                        return (
                                            <View key={u.id} style={styles.commentContainer}>
                                                <Text style={styles.commentDate}>{new Date(u.fecha).toLocaleString()}</Text>
                                                <Text style={styles.commentText}>{u.nota}</Text>
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
                        nota={notaSeleccionada}
                        setNotaModal={setNotaModal}
                    />
                </Modal>

                <Modal
                    visible={fromModal}
                    animationType="slide"
                    onRequestClose={() => setFormModal(false)}
                >
                    <FormNota
                        nota={notaSeleccionada}
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
