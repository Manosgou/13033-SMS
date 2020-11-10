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
import CheckBox from "@react-native-community/checkbox";

//Colors
import { Colors } from "../Colors";

interface IState {
  selection: string;
  selectionError: string;
  lastname: string;
  lastnameError: string;
  firstname: string;
  firstnameError: string;
  address: string;
  addressError: string;
  autoLoad: boolean;
}
export default class Form extends Component<IState> {
  state: IState = {
    selection: "",
    selectionError: "",
    lastname: "",
    lastnameError: "",
    firstname: "",
    firstnameError: "",
    address: "",
    addressError: "",
    autoLoad: false,
  };

  handleInputChange = (inputName: string, inputValue: string) => {
    if (inputValue != "0") {
      this.setState((state) => ({
        ...state,
        [inputName]: inputValue,
      }));
    }
  };

  sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      console.log("SMS is available on this device");
      if (
        (this.handleValidation() && this.checkSelection()) ||
        this.checkSelection()
      ) {
        await SMS.sendSMSAsync(["13033"], this.getFinalMsg());
      }
    } else {
      alert("Το κινητό σας δεν υποστηρίζει αποστολή μηνυμάτων SMS.");
    }
  };

  storeData = async () => {
    let keys: string[] = [];
    try {
      keys = await AsyncStorage.getAllKeys();
    } catch (e) {}

    if (keys.includes("@data")) {
      let data: { firstname: string; lastname: string; address: string } = {
        firstname: "",
        lastname: "",
        address: "",
      };
      try {
        data = JSON.parse((await AsyncStorage.getItem("@data")) || "");
      } catch (e) {
        console.log("saving error");
      }
      if (
        data.firstname === this.state.firstname &&
        data.lastname === this.state.lastname &&
        data.address === this.state.address
      ) {
        alert("Τα στοιχεία έχουν ήδη αποθηκευτεί.");
        return;
      }
    }
    if (this.handleValidation()) {
      let data = {
        lastname: this.state.lastname,
        firstname: this.state.firstname,
        address: this.state.address,
      };
      try {
        await AsyncStorage.setItem("@data", JSON.stringify(data));
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
  };

  getData = async () => {
    try {
      const data = JSON.parse((await AsyncStorage.getItem("@data")) || "");
      if (
        data.firstname !== null &&
        data.lastname !== null &&
        data.address !== null
      ) {
        this.setState({
          firstname: data.firstname,
          lastname: data.lastname,
          address: data.address,
        });
      } else {
        alert("Δεν έχουν αποθηκευτεί στοιχεία.");
      }
    } catch (e) {
      console.log("error reading value");
    }
  };

  checkSelection = () => {
    if (this.state.selection != "") {
      return true;
    } else {
      this.setState({ selectionError: "Παρακαλώ επιλέξτε λόγο μετακίνησης." });
      return false;
    }
  };

  handleValidation = (): boolean => {
    let inputIsValid = true;
    if (!this.state.firstname.trim()) {
      inputIsValid = false;
      this.setState({ firstnameError: "Παρακαλώ εισάγετε όνομα." });
    }

    if (!this.state.lastname.trim()) {
      inputIsValid = false;
      this.setState({ lastnameError: "Παρακαλώ εισάγετε επίθετο." });
    }

    if (!this.state.address.trim()) {
      inputIsValid = false;
      this.setState({ addressError: "Παρακαλώ εισάγετε διεύθυνση." });
    }

    return inputIsValid;
  };

  autoLoad = () => {
    this.setState({ autoLoad: !this.state.autoLoad }, async () => {
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
    // await AsyncStorage.clear()
    try {
      const autoLoad = JSON.parse(
        (await AsyncStorage.getItem("@autoLoad")) || ""
      );
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
          <Text style={{ color: Colors.white }}>Λόγος μετακίνησης:</Text>
          <Picker
            selectedValue={this.state.selection || ""}
            style={styles.picker}
            onValueChange={(value) =>
              this.handleInputChange("selection", value.toString())
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
          <Text style={{ color: Colors.disabled, textAlign: "center" }}>
            {this.state.selectionError}
          </Text>
        </View>
        <View>
          <View>
            <Text style={{ color: Colors.white }}>Όνομα:</Text>
            <TextInput
              style={styles.textInput}
              defaultValue={this.state.firstname}
              onChangeText={(value) =>
                this.handleInputChange("firstname", value)
              }
            />
            <Text style={{ color: Colors.disabled, textAlign: "center" }}>
              {this.state.firstnameError}
            </Text>
            <Text style={{ color: Colors.white }}>Επίθετο:</Text>
            <TextInput
              style={styles.textInput}
              defaultValue={this.state.lastname}
              onChangeText={(value) =>
                this.handleInputChange("lastname", value)
              }
            />
            <Text style={{ color: Colors.disabled, textAlign: "center" }}>
              {this.state.lastnameError}
            </Text>
            <Text style={{ color: Colors.white }}>Διεύθυνση:</Text>
            <TextInput
              style={styles.textInput}
              defaultValue={this.state.address}
              onChangeText={(value) => this.handleInputChange("address", value)}
            />
            <Text style={{ color: Colors.disabled, textAlign: "center" }}>
              {this.state.addressError}
            </Text>
          </View>
          <View style={{ paddingLeft: 60, paddingRight: 60 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.storeData()}
            >
              <Text style={{ color: "#000" }}>Αποθηκευση στοιχειων</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: Colors.white }}>
            Αυτόματη φόρτωση στοιχείων:{" "}
          </Text>
          <CheckBox
            value={this.state.autoLoad}
            onValueChange={() => this.autoLoad()}
          />
        </View>
        <View>
          <Text style={styles.previewText}>Προεπισκόπηση μηνύματος</Text>
          <Text style={styles.previewBox}>{this.getFinalMsg()}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.sendSMS()}
          >
            <Text style={{ color: "#000" }}>Αποστολη</Text>
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
    width: 300,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    color: Colors.white,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 50,
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
    textAlign: "center",
    fontSize: 7,
    color: Colors.white,
  },
  picker: {
    color: Colors.white,
  },
  pickerContainer: {
    marginTop: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    color: Colors.white,
  },
});
