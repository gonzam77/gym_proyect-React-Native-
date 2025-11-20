import { Pressable, Image, Animated, Text } from "react-native"
import styles from '../../styles/botonesStyles'
import { useRef } from "react"


export const BotonGuardar = ({ onPress }) => {
    return (
        <Pressable 
            style={styles.iconButton} 
            onPress={onPress}
        >
            <Image style={{width:60,height:60}} source={require('../../assets/img/guardar.png')}></Image>
        </Pressable>
    )
}

export const BotonEditar = ({ onPress }) => {
    return (
        <Pressable
            style={styles.iconButton}
            onPress={onPress}
        >
            <Image style={{ width:56, height:56 }} source={require('../../assets/img/editar.png')}></Image>
        </Pressable>
    )
}

export const BotonBorrar = ({ onPress }) => {
    return (
        <Pressable
          style={styles.iconButton}
          onPress={onPress}
        >
          <Image style={styles.iconos} source={require('../../assets/img/eliminar.png')}></Image>
        </Pressable>
    )
}

export const BotonReiniciar = ({ onPress }) => {
    return(
        <Pressable 
            onPress={onPress}
        >
            <Image style={styles.iconos} source={require('../../assets/img/reiniciar.png')}></Image>
        </Pressable>
    )
}

export const BotonVolver = ({ onPress }) => {
    return(
        <Pressable
            style={styles.iconButton}
            onPress={onPress}
        >
            <Image style={styles.iconos} source={require('../../assets/img/volver.png')}></Image>
        </Pressable>
    ) 
}

export const BotonPlay = ({ onPressIn, onPressOut, onPress }) => {

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const presionarIn = () => {
        Animated.spring(scaleAnim, {
        toValue: 0.90,
        useNativeDriver: true,
        }).start();
    };

    const presionarOut = () => {
        Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
        }).start();
    };

    return(
        <Pressable
            onPressIn={presionarIn}
            onPressOut={presionarOut}
            style={styles.iconButton}
            onPress={onPress}
        >
            <Animated.Image style={[
                {
                width: 70,
                height: 70,
                transform: [{ scale: scaleAnim }],
                }
            ]} source={require('../../assets/img/play.png')} />
        </Pressable>
    ) 
}

export const Boton = ({ onPress, children }) => {
    return (
        <Pressable 
            style={styles.btn}
            onPress={onPress}
        >
            <Text style={styles.btnTexto}>{ children } </Text>
        </Pressable>
    )
}