import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SMS from "expo-sms";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

//Colors
import {Colors} from '../Colors';


export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: "",
      lastname: "",
      firstname: "",
      address: "",
      autoLoad: false,
    };
  }

  handleInputChange = (inputName, inputValue) => {
    if (inputValue != "0") {
      this.setState((state) => ({
        ...state,
        [inputName]: inputValue,
      }));
    }
  };

  onPress = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      console.log("SMS is available on this device");
      if (this.checkInput() === true && this.checkSelection() === true) {
        const { result } = await SMS.sendSMSAsync(
          ["13033"],
          this.getFinalMsg()
        );
      } else {
        alert("Παρακαλώ συμπληρώστε όλα τα στοιχεία");
      }
    } else {
      alert("Το κινητό σας δεν υποστηρίζει αποστολή μηνυμάτων SMS");
    }
  };

  storeData = async () => {
    if (this.checkInput() === true) {
      const firstname = await AsyncStorage.getItem("firstname");
      const lastname = await AsyncStorage.getItem("lastname");
      const address = await AsyncStorage.getItem("address");

      if (
        firstname === this.state.firstname &&
        lastname === this.state.lastname &&
        address === this.state.address
      ) {
        alert("Τα στοιχεία έχουν ήδη αποθηκευτεί");
      } else {
        try {
          await AsyncStorage.setItem("firstname", this.state.firstname);
          await AsyncStorage.setItem("lastname", this.state.lastname);
          await AsyncStorage.setItem("address", this.state.address);
          alert(
            "Επιτυχής αποθήκεσυη!\nΌνομα:" +
              this.state.firstname +
              "\nΕπίθετο:" +
              this.state.lastname +
              "\nΔιεύθυνση:" +
              this.state.address
          );
        } catch (e) {
          console.log("saving error");
        }
      }
    } else {
      alert("Συμπληρώστε όλα τα πεδία");
    }
  };

  getData = async () => {
    try {
      const firstname = await AsyncStorage.getItem("firstname");
      const lastname = await AsyncStorage.getItem("lastname");
      const address = await AsyncStorage.getItem("address");

      if (firstname !== null && lastname !== null && address !== null) {
        this.setState({
          firstname: firstname,
          lastname: lastname,
          address: address,
        });
      } else {
        alert("Δεν έχουν αποθηκευτεί στοιχεία");
      }
    } catch (e) {
      console.log("error reading value");
    }
  };

  checkSelection = () => {
    if (this.state.selection != "") {
      return true;
    } else {
      return false;
    }
  };

  checkInput = () => {
    if (this.state.firstname.trim() != "") {
      if (this.state.lastname.trim() != "") {
        if (this.state.address.trim() != "") {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  autoLoad = () => {
    this.setState({ autoLoad: !this.state.autoLoad }, async function () {
      try {
        await AsyncStorage.setItem(
          "@autoLoad",
          JSON.stringify(this.state.autoLoad)
        );
      } catch (e) {
        console.log("saving error");
      }
    });
  };

  getFinalMsg = () => {
    return (
      this.state.selection +
      " " +
      this.state.firstname +
      this.state.lastname +
      " " +
      this.state.address
    );
  };
  async componentDidMount() {
    try {
      const autoLoad = JSON.parse(await AsyncStorage.getItem("@autoLoad"));
      if (autoLoad !== null) {
        this.setState({ autoLoad: autoLoad });
      }
      if (this.state.autoLoad) {
        this.getData();
      }
    } catch (e) {
      console.log("saving error");
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.pickerContainer}>
          <Text style={{color:Colors.white}}>Λόγος μετακίνησης:</Text>
          <Picker
            selectedValue={this.state.selection || ""}
            style={styles.picker}
            onValueChange={(value) =>
              this.handleInputChange("selection", value)
            }
            mode="dialog"
          >
            <Picker.Item
              label="Επιλέγξτε λόγο μετακίνησης"
              value="0"
              color={Colors.grey}
            />
            <Picker.Item
              label="Μετάβαση σε φαρμακείο ή στον γιατρό."
              value="1"
            />
            <Picker.Item
              label="Μετάβαση σε εν λειτουργία κατάστημα."
              value="2"
            />
            <Picker.Item label="Μετάβαση στην τράπεζα, στο μέτρο." value="3" />
            <Picker.Item label="Κίνηση για παροχή βοήθειας." value="4" />
            <Picker.Item
              label="Μετάβαση σε τελετή(γάμος, βάφτιση)."
              value="5"
            />
            <Picker.Item
              label="Σύντομη μετακίνηση,σωματική άσκηση."
              value="6"
            />
          </Picker>
        </View>
        <View style={styles.textInputContainer}>
          <Text style={{ color:Colors.white }}>Όνομα:</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={this.state.firstname}
            onChangeText={(value) => this.handleInputChange("firstname", value)}
          />

          <Text style={{ color:Colors.white }}>Επίθετο:</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={this.state.lastname}
            onChangeText={(value) => this.handleInputChange("lastname", value)}
          />

          <Text style={{ color:Colors.white }}>Διεύθυνση:</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={this.state.address}
            onChangeText={(value) => this.handleInputChange("address", value)}
          />
        </View>
        <Text style={styles.previewText}>Προεπισκόπηση μηνύματος</Text>
        <Text style={styles.previewBox}>{this.getFinalMsg()}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onPress()}
          >
            <Text>Αποστολη</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.storeData()}
          >
            <Text>Αποθηκευση στοιχειων</Text>
          </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.autoLoad()}
              style={[
                styles.button,
                this.state.autoLoad
                  ? { backgroundColor: Colors.PrimaryColor }
                  : { backgroundColor: Colors.disabled },
              ]}
            >
              <Text>Αυτόματη φόρτωση στοιχείων</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.createdBy}>Created by Manos Gouvrikos</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: 300,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    color: Colors.white,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 30,
    color: "#006400",
  },

  previewBox: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    color: Colors.white,
  },
  previewText: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.white,
  },
  createdBy: {
    fontSize: 7,
    textAlign: "center",
    marginTop: 10,
    color: Colors.white,
  },
  picker: {
    color: Colors.white,
  },
  pickerContainer: {
    marginTop: 30,
  },
  button: {
    alignItems: "center",
    backgroundColor:Colors.white,
    padding: 10,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 20,
    color: Colors.white,
  },
});
