import { View, Text, Pressable, ScrollView } from "react-native";

const Notas = () => {
    return (
        <ScrollView>
        <View>
            <Text>
                Sección de notas.
            </Text>
        </View>
        <View>
            <Text>
                Categoria
            </Text>
        </View>

        <View>
            <Text>
                Listado de notas filtradas
            </Text>
        </View>
        </ScrollView>
    )
};


export default Notas;