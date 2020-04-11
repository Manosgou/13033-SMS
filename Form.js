import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SMS from 'expo-sms';
import { AsyncStorage } from "react-native";

import Appbar from './Appbar.js';

export default class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selection: '',
            lastname: '',
            firstname: '',
            address: '',

        };


    }





    handleInputChange = (inputName, inputValue) => {
        this.setState(state => ({
            ...state,
            [inputName]: inputValue
        }))
    }


    onPress = async () => {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            console.log("SMS is available on this device")
            if (this.checkInput() === true && this.checkSelection() === true) {
                const { result } = await SMS.sendSMSAsync(
                    ['13033'],
                    this.getFinalMsg()
                );
            } else {
                alert('Παρακαλώ συμπληρώστε όλα τα στοιχεία');
            }
        } else {
            alert("Το κινητό σας δεν υποστηρίζει αποστολή μηνυμάτων SMS")

        }




    };



    storeData = async () => {
        if (this.checkInput() === true) {
            try {

                await AsyncStorage.setItem('firstname', this.state.firstname)
                await AsyncStorage.setItem('lastname', this.state.lastname)
                await AsyncStorage.setItem('address', this.state.address)
                alert('Επιτυχής αποθήκεσυη!\nΌνομα:' + this.state.firstname + '\nΕπίθετο:' + this.state.lastname + '\nΔιεύθυνση:' + this.state.address)

            } catch (e) {
                console.log('saving error')

            }

        } else {
            alert("Συμπληρώστε όλα τα πεδία")
        }
    }

    getData = async () => {
        try {

            const firstname = await AsyncStorage.getItem('firstname')
            const lastname = await AsyncStorage.getItem('lastname')
            const address = await AsyncStorage.getItem('address')



            if (firstname !== null && lastname !== null && address !== null) {
                this.setState({
                    firstname: firstname,
                    lastname: lastname,
                    address: address

                })

            } else {
                alert('Δεν έχουν αποθηκευτεί στοιχεία')
            }
        } catch (e) {
            console.log('error reading value')
        }
    }



    checkSelection = () => {
        if (this.state.selection != '') {
            return true
        } else {
            return false
        }
    }

    checkInput = () => {

        if (this.state.firstname.trim() != '') {
            if (this.state.lastname.trim() != '') {
                if (this.state.address.trim() != '') {
                    return true


                }

            }
        } else {
            return false


        }

    };

    getFinalMsg() {
        return this.state.selection.substring(0, 1) + " " + this.state.firstname + this.state.lastname + " " + this.state.address
    }


    render() {

        const styles = StyleSheet.create({
            mainContainer: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: 300,


            },
            textInput: {
                borderBottomWidth: 1,
                borderBottomColor: "grey"

            },
            textInputContainer: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',

            },
            button: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                padding: 30
            },

            previewBox: {
                borderColor: "grey",
                borderWidth: 2,
                borderRadius: 10,
                padding: 10
            },
            previewText: {
                textAlign: "center",
                marginTop: 30

            },
            createdBy: {
                fontSize: 7,
                textAlign: 'center',
                marginTop: 10
            },


        });




        let fselection = [{

            value: '1)Μετάβαση σε φαρμακείο',

        }, {

            value: '2)Μετάβαση σε εν λειτουργία καταστήματα',

        }, {

            value: '3)Μετάβαση σε τράπεζα',

        },
        {

            value: '4)Παροχή βοήθειας',

        },
        {

            value: '5)Μετάβαση σε τελετή',

        },
        {

            value: '6)Σύντομη μετακίνηση',

        },];





        return (<>
            <Appbar />
            <View style={styles.mainContainer}>



                <Dropdown
                    value={this.state.selection || ''}
                    label='Επιλογή:'
                    data={fselection}
                    onChangeText={value => this.handleInputChange('selection', value)}

                />
                <View style={styles.textInputContainer}>
                    <Text>Όνομα:</Text>
                    <TextInput
                        style={styles.textInput}
                        defaultValue={this.state.firstname}
                        onChangeText={value => this.handleInputChange('firstname', value)}
                    />


                    <Text>Επίθετο:</Text>
                    <TextInput
                        style={styles.textInput}
                        defaultValue={this.state.lastname}
                        onChangeText={value => this.handleInputChange('lastname', value)}
                    />



                    <Text>Διεύθυνση:</Text>
                    <TextInput
                        style={styles.textInput}
                        defaultValue={this.state.address}
                        onChangeText={value => this.handleInputChange('address', value)}

                    />
                </View>
                <Text style={styles.previewText}>Προεπισκόπηση</Text>
                <Text style={styles.previewBox}>{this.getFinalMsg()}</Text>
                <View style={styles.button}>
                    <Button
                        title="Αποστολη"
                        onPress={this.onPress}

                    />
                    <Button
                        title="Αποθηκευση στοιχειων"
                        onPress={this.storeData}

                    />
                    <Button
                        title="Φορτωση στοιχειων"
                        onPress={this.getData}

                    />


                </View>
                <Text style={styles.createdBy}>
                    Created by Manos Gouvrikos
                </Text>

            </View >
        </>
        );





    }



}