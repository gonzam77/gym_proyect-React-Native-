import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import styles from "../../styles/notasStyles";


const Notas = () => {

    const notasHistoricas = useSelector(state => state.notasHistoricas.notasHistoricas);
    console.log('notasHistoricas',notasHistoricas);

    return (
        <ScrollView style={styles.container}>
            {notasHistoricas?.map(notaHistorica => (
                <View key={notaHistorica.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{notaHistorica.titulo}</Text>

                    {notaHistorica.notas?.map(nota => {
                        const fecha = new Date(nota.fecha).toLocaleString();
                        return (
                            <View key={nota.id} style={styles.commentContainer}>
                                <Text style={styles.commentDate}>{fecha}</Text>
                                <Text style={styles.commentText}>{nota.nota}</Text>
                            </View>
                        );
                    })}
                </View>
            ))}
        </ScrollView>
    );
};

export default Notas;
