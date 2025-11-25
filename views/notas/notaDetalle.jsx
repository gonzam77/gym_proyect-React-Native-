import { View, Text, ScrollView, Pressable } from "react-native";
import styles from "../../styles/notasStyles";
import Icon from 'react-native-vector-icons/Ionicons';

const NotaDetalle = ({ nota, setNotaModal })=>{
    console.log('nota',nota);
    const listadoNotas = [...nota.notas].reverse();

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
            >
                <Icon name="chatbubble-ellipses-outline" size={25}></Icon>
            </Pressable>
        </View>
    )
}

export default NotaDetalle;