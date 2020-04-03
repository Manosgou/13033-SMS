import React, { useState } from 'react';
import { Appbar } from 'material-bread';
import { View, Text, StyleSheet } from 'react-native';






const styles = StyleSheet.create({
    appbar: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        paddingVertical: 0,
        paddingHorizontal: 8,
    },
    center: {
        flex: 1,
        alignItems: 'center'

    },
    title: {
        color: '#eee',
        textAlign: 'center',
        fontSize: 28,
        marginTop: 30,
        

    },
    

});



export default function Topbar() {




    return (

        <View>
            <Appbar style={styles.appbar} >


                <View style={styles.center}>
                    <Text style={styles.title}>13033-SMS</Text>
                </View>

            </Appbar >


        </View>

    );




}