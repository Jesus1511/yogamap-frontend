import { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ListProf } from '../List/ListProf';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

export function ShowTypeOfYoga({ route }) {
    const { id } = route.params;
    const navigation = useNavigation();
    const [data, setData] = useState({});
    const [option, setOption] = useState([]);
    const [visibleItem, setVisibleItem] = useState([]);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/TypeOfYoga.php', { id }, { headers: { 'Content-Type': 'application/json' } });
                
                if (response.data.success) {
                    if(response.data.type){
                        setData(response.data.type);
                        setOption(JSON.parse(response.data.type.keyelement));
                    } else { 
                        setData({}); 
                    }
                }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar el tipo de yoga...", error);
            }
        };
    
        connection();
    }, [id]);

    useEffect(() => {
        if (option.length > 0) {
            setVisibleItem(option.map(() => false));
        }
    }, [option]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: data.name,
            headerRight: () => (
                <MaterialIcons 
                    name="edit"
                    size={24}
                    style={styles.iconRight}
                    onPress={() => navigation.navigate('EditTypeOfYoga')}
                />
            ),
        });
    }, [navigation, data.name]);

    const toggleVisibility = (index) => {
        setVisibleItem((prevVisibleItems) =>
            prevVisibleItems.map((item, i) => i === index ? !item : item)
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: 'http://192.168.100.2/API_Yogamap/assets/TypesOfYoga/' + data.id + '.png'}} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{data.name}</Text>
                <Text style={styles.description}>{data.description}</Text>
                {option && option.map((item, index) => {
                    let nameIcon = visibleItem[index] ? "keyboard-arrow-up" : "keyboard-arrow-right";
                    return (
                        <View key={index}>
                            <Pressable style={styles.dropdown} onPress={() => toggleVisibility(index)}>
                                <Text style={styles.subtitle}>{item.title}</Text>
                                <MaterialIcons name={nameIcon} size={24} color='#fff' />
                            </Pressable>
                            {visibleItem[index] && (
                                <View style={styles.desplegable}>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
                <Text style={[styles.subtitle, { marginTop: 16 }]}>Profes de Hatha Yoga</Text>
                <ListProf count="3" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
        gap: 16,
    },
    icon: { color: '#fff', },
    iconRight: { color: '#fff', },
    image:{
        width: '100%',
        aspectRatio: '16 / 9',
        marginBottom: 16,
    },
    content:{
        padding: '4%',
        paddingTop: 0,
        gap: 8,
        marginBottom: 24,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        color: '#fff',
        opacity: 0.5,
        fontSize: 14,
        lineHeight: 20,
    },
    subtitle:{
        color: '#fff',
        opacity: 0.75,
        fontWeight: 'bold',
        fontSize: 16,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,

    },
    desplegable: {
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,
        paddingVertical: 16,
    },

});