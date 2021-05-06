import React, { Component } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image, Alert, Linking, ActivityIndicator, CheckBox} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import { BackHandler } from 'react-native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';

class SettingsScreen extends Component {


  constructor(props) {
    super(props);
    this.state = { file: String, notifications: false, barcode: false, inventario: false, entradas: false, salidas: false, pedido: false, venta: false, compra: false, orden_trabajo: false, listin: false  }
  }

  goBarcode = () => {
    this.props.navigation.navigate("Barcode")
  }

  goListin = () => {
    this.props.navigation.navigate("Listin")
  }

  goHome = () => {
    this.props.navigation.navigate("Home")
  }

  showOrdenTrabajo() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.orden_trabajo)}
        onValueChange={this.setOrdenTrabajo}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Orden de trabajo</Text></View>;
    }
    return null;
  }

  showCompra() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.compra)}
        onValueChange={this.setCompra}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Compra</Text></View>;
    }
    return null;
  }

  showVenta() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.venta)}
        onValueChange={this.setVenta}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Venta</Text></View>;
    }
    return null;
  }


  showPedido() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.pedido)}
        onValueChange={this.setPedido}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Pedido</Text></View>;
    }
    return null;
  }

  showSalidas() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.salidas)}
        onValueChange={this.setSalidas}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Salidas</Text></View>;
    }
    return null;
  }

  showEntradas() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.entradas)}
        onValueChange={this.setEntradas}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Entradas</Text></View>;
    }
    return null;
  }

  showInventario() {
    if (this.state.barcode) {
      return <View style={styles.checkboxContainer}>
        <CheckBox
        value={JSON.parse(this.state.inventario)}
        onValueChange={this.setInventario}
        style={styles.checkbox}
      /><Text style={styles.appButtonTextTitle}>Inventario</Text></View>;
    }
    return null;
  }

  saveName = async () => {
    await AsyncStorage.setItem('filename', this.state.file)
  }

  showExportOptions() {
    if (this.state.barcode) {
      return <View><Text></Text><Text style={styles.appButtonTextTitle}>Exportación de códigos</Text><Text></Text>
      <TextInput value={this.state.file} placeholder="Nombre del fichero de exportación" style ={{ alignSelf: 'center', textAlign: 'center', fontSize: 17 }} onChangeText={(file) => this.setState({file})}  />
      <Text></Text>
      <TouchableOpacity onPress={this.saveName}>
      <Text style={styles.appButtonTextSave}>Guardar nombre</Text>
      </TouchableOpacity> 
      <Text></Text><Text></Text></View>;
    }
    return null;
  }

  showBarcodeButton(){
    if (this.state.barcode) {
      return <Ionicons 
       name="barcode" 
       onPress={this.goBarcode}
       size={25} 
       color="white"
       style={styles.navBarButton}
     />;
    }
    return null;
  }

  showListinButton(){
    if (this.state.listin) {
      return <Ionicons 
      name="call" 
      onPress={this.goListin}
      size={25} 
      color="white"
      style={styles.navBarButton}
    />
    }
    return null;
  }

  async loadOptions() {
    await AsyncStorage.getItem("filename").then((value) => {
      if (value == null) {
        value = ""
      }
      this.setState({ file: value })
    })
    await AsyncStorage.getItem("inventario").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ inventario: value })
    })
    await AsyncStorage.getItem("entradas").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ entradas: value})
    })
    await AsyncStorage.getItem("salidas").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ salidas: value})
    })
    await AsyncStorage.getItem("pedido").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ pedido: value})
    })
    await AsyncStorage.getItem("venta").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ venta: value})
    })
    await AsyncStorage.getItem("compra").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ compra: value})
    })
    await AsyncStorage.getItem("orden_trabajo").then((value) => {
      if (value == null) {
        value = false
      }
      this.setState({ orden_trabajo: value})
    })
  }

  async componentDidMount() {
    await AsyncStorage.getItem("notifications").then((value) => {
      if (value == null) {
        value = true
      }
      this.setState({ notifications: value})
    })

    await AsyncStorage.getItem("barcode").then((value) => {
      if (value == null) {
        value = true
      }
      this.setState({ barcode: value })
    })
    await AsyncStorage.getItem("listin").then((value) => {
      if (value == null) {
        value = true
      }
      this.setState({ listin: value})
    })
    if (this.state.barcode) {
      this.loadOptions()
    }
  }

  setInventario = async() => {
    var value = !JSON.parse(this.state.inventario)
    await AsyncStorage.setItem('inventario', JSON.stringify(value))
    this.setState({inventario: value})
  }

  setEntradas = async() => {
    var value = !JSON.parse(this.state.entradas)
    await AsyncStorage.setItem('entradas', JSON.stringify(value))
    this.setState({entradas: value})
  }

  setSalidas = async() => {
    var value = !JSON.parse(this.state.salidas)
    await AsyncStorage.setItem('salidas', JSON.stringify(value))
    this.setState({salidas: value})
  }

  setPedido = async() => {
    var value = !JSON.parse(this.state.pedido)
    await AsyncStorage.setItem('pedido', JSON.stringify(value))
    this.setState({pedido: value})
  }

  setVenta = async() => {
    var value = !JSON.parse(this.state.venta)
    await AsyncStorage.setItem('venta', JSON.stringify(value))
    this.setState({venta: value})
  }

  setCompra = async() => {
    var value = !JSON.parse(this.state.compra)
    await AsyncStorage.setItem('compra', JSON.stringify(value))
    this.setState({compra: value})
  }

  setOrdenTrabajo = async() => {
    var value = !JSON.parse(this.state.orden_trabajo)
    await AsyncStorage.setItem('orden_trabajo', JSON.stringify(value))
    this.setState({orden_trabajo: value})
  }

  setNotification = async() => {
    var value = !JSON.parse(this.state.notifications)
    await AsyncStorage.setItem('notifications', JSON.stringify(value))
    this.setState({notifications: value})
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <View style={styles.navBar}>
          <Text style={styles.navBarHeader}>Configuración</Text>
        </View>
        <View style={{flex: 1}}>
          <Text></Text>
          <View style={styles.checkboxContainer}>
          <CheckBox
          value={JSON.parse(this.state.notifications)}
          onValueChange={this.setNotification}
          style={styles.checkbox}
        />
        <Text style={styles.appButtonTextTitle}>Notificaciones</Text>
          </View>
        {this.showExportOptions()}
        {this.showInventario()}
        {this.showEntradas()}
        {this.showSalidas()}
        {this.showPedido()}
        {this.showVenta()}
        {this.showCompra()}
        {this.showOrdenTrabajo()}
        </View>
        <View style={styles.navBar}>
          <Ionicons 
            name="home" 
            onPress={this.goHome}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          {this.showListinButton()}
          {this.showBarcodeButton()}
        </View>
        </View>
    )
  }
}

class ExportCodesScreen extends Component {

  inventario = false
  entradas = false
  salidas = false
  pedido = false
  venta = false
  compra = false
  orden_trabajo = false
  sentence = ""
  exportOptions=[]
  filename = ""
  companyid = ""
  idfichero = ""
  userID = ""
  cvsContent = ""
  barcodes = []

  constructor(props) {
    super(props);
    this.init();
  }

  async init() {
    await AsyncStorage.getItem("barcodes").then((value) => {
      if (value == null) {
        value = []
      }
      this.barcodes = value
    })
    await AsyncStorage.getItem("idfichero").then((value) => {
      if (value == null) {
        value = ""
      }
      this.idfichero = value
    })
    await AsyncStorage.getItem("userID").then((value) => {
      if (value == null) {
        value = ""
      }
      this.userID = value
    })
    await AsyncStorage.getItem("idempresa").then((value) => {
      if (value == null) {
        value = ""
      }
      this.companyid = value
    })
    await AsyncStorage.getItem("filename").then((value) => {
      if (value == null) {
        value = ""
      }
      this.filenameExport = value
    })
    await AsyncStorage.getItem("inventario").then((value) => {
      if (value == null) {
        value = false
      }
      this.inventario = JSON.parse(value)
    })
    await AsyncStorage.getItem("entradas").then((value) => {
      if (value == null) {
        value = false
      }
      this.entradas = JSON.parse(value)
    })
    await AsyncStorage.getItem("salidas").then((value) => {
      if (value == null) {
        value = false
      }
      this.salidas = JSON.parse(value)
    })
    await AsyncStorage.getItem("pedido").then((value) => {
      if (value == null) {
        value = false
      }
      this.pedido = JSON.parse(value)
    })
    await AsyncStorage.getItem("venta").then((value) => {
      if (value == null) {
        value = false
      }
      this.venta = JSON.parse(value)
    })
    await AsyncStorage.getItem("compra").then((value) => {
      if (value == null) {
        value = false
      }
      this.compra = JSON.parse(value)
    })
    await AsyncStorage.getItem("orden_trabajo").then((value) => {
      if (value == null) {
        value = false
      }
      this.orden_trabajo = JSON.parse(value)
    })
    this.sentence = " "
    if (this.inventario) {
      this.sentence += "inventario, "
      this.exportOptions.push("I")
    }
    if (this.entradas) {
      this.sentence += "entradas, "
      this.exportOptions.push("E")
    }
    if (this.salidas) {
      this.sentence += "salidas, "
      this.exportOptions.push("S")
    }
    if (this.pedido) {
      this.sentence += "pedidos, "
      this.exportOptions.push("P")
    }
    if (this.venta) {
      this.sentence += "ventas, "
      this.exportOptions.push("V")
    }
    if (this.compra) {
      this.sentence += "compras, "
      this.exportOptions.push("C")
    }
    if (this.orden_trabajo) {
      this.sentence += " orden de trabajo  "
      this.exportOptions.push("O")
    }
  }

  async generateCVS(){
    var objArray = JSON.stringify(this.barcodes)
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    let row = ''; 
    for (let index in this.headerRow) { 
        row += this.headerRow[index] + ', '; 
    } 
    row = row.slice(0, -1); 
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    this.cvsContent = str;
  }

  async removeAllCodes() {
    var array = []
    this.setState({barcodes: array});
    await new AsyncStorage.setItem("barcodes", JSON.stringify(array))
    this.props.navigation.push("Barcode")
  }

  async askReset() {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Eliminar los códigos",
        "¿Desea eliminar permanentemente todos los códigos escaneados?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.removeAllCodes());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve("No");
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  async postImportaBarra() {
    await fetch('https://desarrollo.dicloud.es/services/importabarra.asp?'+this.filename)
    .then(responseJson => {
      this.askReset()
    }).catch((err) => {console.log(err)});
  }

  postCodes() {
    this.generateCVS()
    var date = moment().format("YYYY-MM-DD");
    var hour = moment().format("HH:mm");
    this.exportOptions.forEach(i => {
      this.filename =  "idfichero="+ this.idfichero + "&id=" + this.companyid + "&vari=" + i + "_" + this.filenameExport + ";"+date+";"+hour+";"+this.userID+"$$"+this.cvsContent.substring(0, this.cvsContent.length-2)
      this.postImportaBarra()
    })
  }

  sendCodes = async() => {
    if (this.filenameExport == "") {
      alert("No ha completado el nombre del archivo de configuración. Vaya a configuración.")
    } else if (this.exportOptions.length > 0) {
      const AsyncAlert = (title, msg) => new Promise((resolve) => {
        Alert.alert(
          "Enviar códigos",
          "¿Está seguro que desea enviar los códigos a"+this.sentence.substring(0,this.sentence.length-2)+"?",
          [
            {
              text: 'Sí',
              onPress: () => {
                resolve(this.postCodes());
              },
            },
            {
              text: 'No',
              onPress: () => {
                resolve("No");
              },
            },
          ],
          { cancelable: false },
        );
      });
      await AsyncAlert();
    } else {
      alert("No ha seleccionado ninguna opción de exportación. Vaya a configuración.")
    }
  }

  auxMenu(){
    if (this.props.navigation.state.params.barcodes.length > 0) {
      return <Ionicons 
       name="send" 
       onPress={this.sendCodes}
       size={25} 
       color="white"
       style={styles.navBarButton}
     />;
    }
    return null;
  }

  showFlatList(){
    if (this.props.navigation.state.params.barcodes.length > 0) {
      return <Text style={styles.appButtonTextSave}>Todos los códigos escaneados</Text>
    }
    return <Text style={styles.appButtonTextSave}>No ha escaneado ningún código aún</Text>
  }

  saveLogout =  async (state) => {
    await AsyncStorage.setItem('lastUser', JSON.stringify(false));
    if (!state) {
      await AsyncStorage.setItem('saveData', JSON.stringify(false));
      this.props.navigation.navigate('Login');
    } else {
      await AsyncStorage.setItem('saveData', JSON.stringify(true));
      this.props.navigation.navigate('Login');
    }
  }

  logout = async () => {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Procedo a desconectar",
        "¿Mantengo tu identificación actual?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.saveLogout(true));
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.saveLogout(false));
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              resolve('Cancel');
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  goSettings = () => {
    this.props.navigation.navigate("Settings")
  }

  goHome = () => {
    this.props.navigation.navigate("Home")
  }

  goBarcode = () => {
    this.props.navigation.navigate("Barcode")
  }

  goListin = () => {
    this.props.navigation.navigate("Listin")
  }

   render() {
    return(
      <View style={{flex: 1}}>
        <View style={styles.navBar}>
          <Text style={styles.navBarHeader}>Exportar códigos</Text>
        </View>
        <View style={{flex: 1}}>
          <Text></Text>
          {this.showFlatList()}
          <FlatList
          data={ this.props.navigation.state.params.barcodes.sort((a,b) => a.time < b.time) } 
          renderItem={({ item, index, separators }) => (
            <TouchableOpacity
              key={item}>
              <View> 
                <Text style={styles.headerAccounts}>{item.code} ({item.quantity})</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.code}
          />
        </View>
        <View style={styles.navBar}>
          <Ionicons 
            name="home" 
            onPress={this.goHome}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          <Ionicons 
            name="settings" 
            onPress={this.goSettings}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          <Ionicons 
            name="barcode" 
            onPress={this.goBarcode}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          {this.auxMenu()}
        </View>
        </View>
    )
   }
}


class ListinScreen extends Component {

  WEBVIEW_REF = "listin"
  webView = {
    canGoBack: false,
    ref: null,
  }

  barcode = false

  constructor(props) {
    super(props);
    this.state = { url: "https://desarrollo.dicloud.es/companies/listin.asp" }
    this.init()
  }

  async init(){
    const barcode = await AsyncStorage.getItem('barcode').catch(() => {
      barcode = false;
    });
    this.barcode = barcode
  }

  reload = () => {
    this.webView.ref.reload();
  }

  goSettings = () => {
    this.props.navigation.navigate("Settings")
  }

  goHome = () => {
    this.props.navigation.navigate("Home")
  }

  goBarcode = () => {
    this.props.navigation.navigate("Barcode")
  }

  showBarcodeButton(){
    if (this.barcode) {
      return <Ionicons 
       name="barcode" 
       onPress={this.goBarcode}
       size={25} 
       color="white"
       style={styles.navBarButton}
     />;
    }
    return null;
  }


  saveLogout =  async (state) => {
    await AsyncStorage.setItem('lastUser', JSON.stringify(false));
    if (!state) {
      await AsyncStorage.setItem('saveData', JSON.stringify(false));
      this.props.navigation.navigate('Login');
    } else {
      await AsyncStorage.setItem('saveData', JSON.stringify(true));
      this.props.navigation.navigate('Login');
    }
  }

  logout = async () => {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Procedo a desconectar",
        "¿Mantengo tu identificación actual?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.saveLogout(true));
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.saveLogout(false));
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              resolve('Cancel');
            },
          },
        ],
        { cancelable: false },
      );
    });
    
    await AsyncAlert();
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <WebView
          ref={(webView) => { this.webView.ref = webView; }}
          originWhitelist={['*']}
          source={{ uri: this.state.url }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          setSupportMultipleWindows={false}
          allowsBackForwardNavigationGestures
          onNavigationStateChange={(navState) => {
            this.setState({
              canGoBack: navState.canGoBack
            });
          }}
          onError={err => {
            this.setState({ err_code: err.nativeEvent.code })
          }}
          renderLoading={() => 
            <View style={styles.loading}>
            <ActivityIndicator color={'white'} size="large"/>
          </View>}
          renderError={()=> {
            if (this.state.err_code == -2){
              return (
                <View style={{ backgroundColor: "white", flex: 1, height:"100%", width: "100%", position:'absolute', justifyContent: "center", alignItems: "center" }}>
                  <Text>No hay conexión a Internet</Text>
                </View>
              );
            }
          }}
          onShouldStartLoadWithRequest={(event) => {
            if ((event.url.indexOf("agententer.asp") || event.url.indexOf("disconect.asp"))  > -1) {
              this.logout()
              return false
            } else if (event.url.includes("drive:") || event.url.includes("tel:") || event.url.includes("mailto:") || event.url.includes("maps") || event.url.includes("facebook")) {
              Linking.canOpenURL(event.url).then((value) => {
                if (value) {
                  Linking.openURL(event.url)
                }
              })
              return false
            } else {
              this.setState({ url: event.url })  
              return true
            }
          }}
        />
        <View style={styles.navBar}>
          <Ionicons 
            name="reload" 
            onPress={this.reload}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          <Ionicons 
            name="home" 
            onPress={this.goHome}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          <Ionicons 
            name="settings" 
            onPress={this.goSettings}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          {this.showBarcodeButton()}
        </View>
    </View>
    )
  }
}


class BarcodeScreen extends Component {
  
  aux_barcodes = []
  
  constructor(props) {
    super(props);
    this.state = { barcodes: [Barcode], code: "", quantity: "1", modify:false, modifyItem: Barcode, showbarcode: false };
  }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Ok",
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  }
  
  async componentDidMount() {
    await AsyncStorage.getItem("barcodes").then((value) => {
      var barcodes = JSON.parse(value)
      if (barcodes == null) {
        barcodes = []
      }
      this.setState({ barcodes: barcodes })
    })
  }

  goSettings = () => {
    this.props.navigation.navigate("Settings")
  }

  sendCodes = () => {
    this.props.navigation.navigate("ExportCodes", {barcodes: this.state.barcodes})
  }

  goHome = () => {
    this.props.navigation.navigate("Home")
  }

  goListin = () => {
    this.props.navigation.navigate("Listin")
  }

  async setBarcode() {
    var b = {
      quantity: this.state.quantity,
      code: this.state.code,
      time: new Date().getTime()
    }
    var array = []
    var contained = false
    this.state.barcodes.forEach(i => {
      if (i.code == this.state.code) {
        contained = true
        var j = {
          quantity: Number(i.quantity) + Number(this.state.quantity),
          code: i.code,
          time: i.time
        }
        if (this.state.modify) {
          j = {
            quantity: Number(this.state.quantity),
            code: i.code,
            time: new Date().getTime()
          }
        }
        array.push(j);
      } else {
        array.push(i);
      }
    })
    if (!contained) {
      var r = {
        quantity: b.quantity,
        code: b.code,
        time: b.time
      }
      array.push(r);
    }
    await new AsyncStorage.setItem("barcodes", JSON.stringify(array))
    this.setState({ barcodes: array })
    this.setState({ code: "" })
    this.setState({ quantity: "1" })
    this.setState({ modify: false })
  }

  async checkEmptyBarcodeList() {
    if (this.state.barcodes.length == 0) {
      var now = moment() + ""
      await new AsyncStorage.setItem("idfichero", now);
    }
    this.setBarcode()
  }
  
  saveCode = async () => {
    this.aux_barcodes = []
    if (this.state.code == "" || this.state.quantity == "") {
      this.showAlert("Error", "Complete todos los campos requeridos")
    } else {
      this.checkEmptyBarcodeList()
    }
  }

  modifyCode = (item) => {
    this.setState({modify:true})
    this.setState({modifyItem: item})
    this.setState({code: item.code})
    this.setState({quantity: item.quantity + ""})
    this.showAlert("Atención", "Modifique el código, la cantidad o ambos como desee")
   }

  async removeItem(item) {
    var array = this.state.barcodes
    var index = array.indexOf(item)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({barcodes: array });
      await new AsyncStorage.setItem("barcodes", JSON.stringify(array))
    }
  }

  async removeCode(item) {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Borrar código de forma permanente",
        "¿Desea borrar el código "+ item.code+" ("+item.quantity+") ?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.removeItem(item));
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve('No');
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              resolve('Cancel');
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  askAction = async (item) => {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Operaciones permitidas",
        "¿Desea borrar o editar "+ item.code+" ("+item.quantity+") ?",
        [
          {
            text: 'Borrar',
            onPress: () => {
              resolve(this.removeCode(item));
            },
          },
          {
            text: 'Editar',
            onPress: () => {
              resolve(this.modifyCode(item));
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              resolve('Cancel');
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  async removeAllCodes() {
    var array = []
    this.setState({barcodes: array});
    await new AsyncStorage.setItem("barcodes", JSON.stringify(array))
  }

  removeAll = async () => {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Eliminar todos los códigos",
        "¿Está seguro de que desea borrar todos los códigos permanentemente?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.removeAllCodes());
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve('No');
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              resolve('Cancel');
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  deleteFlatList() {
    if (this.state.barcodes.length > 0) {
      return <TouchableOpacity onPress={this.removeAll}>
      <Text style={styles.appButtonTextDelete}>Eliminar todos los códigos</Text>
    </TouchableOpacity> 
    }
    return null;
  }

  showFlatList(){
    if (this.state.barcodes.length > 0) {
      return <Text style={styles.appButtonTextSave}>Seleccione el código para eliminar o editar</Text>
    }
    return null
  }

  startBarcode = () => {
    this.setState({ showbarcode: true })
  }

  saveAndQuit = (e) => {
    this.setState({ code: e })
    this.saveCode()
    return true
  }

  saveAndContinue = (e) => {
    this.setState({ code: e })
    this.saveCode()
    this.setState({ showbarcode: true })
    return true
  }

  quitBarcode = () => {
    this.setState({ showbarcode: false })
    return true
  }

  onBarCodeRead = async (e) => {
    this.setState({ showbarcode: false })
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "El código ha sido escaneado",
        "¿Qué desea hacer ahora?",
        [
          {
            text: 'Salir',
            onPress: () => {
              resolve(this.quitBarcode());
            },
          },
          {
            text: 'Guardar y salir',
            onPress: () => {
              resolve(this.saveAndQuit(e.data));
            },
          },
          {
            text: 'Guardar y seguir escaneando',
            onPress: () => {
              resolve(this.saveAndContinue(e.data));
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  render(){
    if (this.state.showbarcode) {
      return (
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onBarCodeRead={this.onBarCodeRead}
        />
      )
    } else {
      return(
        <View style={{flex: 1}}>
          <View style={styles.navBar}>
            <Text style={styles.navBarHeader}>Lector de códigos</Text>
          </View>
          <View style={{flex: 1}}>
          <Text></Text> 
          <Text></Text>
          <TextInput ref={x => { this.codeInput = x }} value={this.state.code} placeholder="Escribir código o escanear directamente" style ={{ alignSelf: 'center', textAlign: 'center', fontSize: 17 }} onChangeText={(code) => this.setState({code})} />
          <TextInput ref={y => { this.quantityInput = y }} value={this.state.quantity} style ={{ alignSelf: 'center', textAlign: 'center', fontSize: 17 }} onChangeText={(quantity) => this.setState({quantity})} keyboardType="numeric" />
          <Text></Text>
          <TouchableOpacity onPress={this.saveCode}>
            <Text style={styles.appButtonTextSave}>Guardar código y seguir</Text>
          </TouchableOpacity> 
          <Text></Text>
          <TouchableOpacity onPress={this.startBarcode} style={styles.appButtonBarcodeContainer}>
            <Text style={styles.appButtonText}>Escanear</Text>
          </TouchableOpacity> 
          <Text></Text>
          {this.deleteFlatList()}
          <Text></Text> 
          <Text></Text>
          {this.showFlatList()}
          <FlatList
          data={ this.state.barcodes.sort((a,b) => a.time < b.time) } 
          renderItem={({ item, index, separators }) => (
            <TouchableOpacity
              key={item}
              onPress={() => this.askAction(item)}>
              <View> 
                <Text style={styles.headerAccounts}>{item.code} ({item.quantity})</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.code}
          />
          </View>
          <View style={styles.navBar}>
            <Ionicons 
              name="home" 
              onPress={this.goHome}
              size={25} 
              color="white"
              style={styles.navBarButton}
            />
            <Ionicons 
              name="settings" 
              onPress={this.goSettings}
              size={25} 
              color="white"
              style={styles.navBarButton}
            />
            <Ionicons 
              name="call" 
              onPress={this.goListin}
              size={25} 
              color="white"
              style={styles.navBarButton}
            />
            <Ionicons 
              name="send" 
              onPress={this.sendCodes}
              size={25} 
              color="white"
              style={styles.navBarButton}
            />
          </View>
          </View>
      )
    }
  }
}

class HomeScreen extends Component { 

  WEBVIEW_REF = "dicloud"
  alias = ""
  user = ""
  password = ""
  fullname = ""
  listin = false
  barcode = false
  token = ""
  webView = {
    canGoBack: false,
    ref: null,
  }
  state = {
    url: ""
  }
  aux_messages = []

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.navigation.state.params.url,
      messages: [Messages]
    }
    this.setWebview()
    this.configNotifications()
    this.setBackgroundFetch()
    this.getNews()
    setInterval(() => {
      this.getNews()
    }, 60000);
  } 

  async getUser() {
    await AsyncStorage.getItem("alias").then((value) => {
      this.alias = value;
    })
    await AsyncStorage.getItem("user").then((value) => {
      this.user = value;
    })
    await AsyncStorage.getItem("password").then((value) => {
      this.password = value;
    })
    await AsyncStorage.getItem("token").then((value) => {
      this.token = value;
    })
    await AsyncStorage.getItem("listin").then((value) => {
      this.listin = value;
    })
    await AsyncStorage.getItem("fullname").then((value) => {
      this.fullname = value;
    })
    await AsyncStorage.getItem("barcode").then((value) => {
      this.barcode = value;
    })
  }

  configNotifications = () => {
    PushNotification.configure({
      onNotification: function(notification) {},
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      requestPermissions: Platform.OS === 'ios',
      popInitialNotification: true,
    });
    PushNotification.createChannel({
      channelId: "channel-id", // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  pushNotification = (message) => {
    PushNotification.localNotification({
      title: "Dicloud",
      message: message,
      playSound: true,
      soundName: 'default',
      channelId: "channel-id"
    });
  }

  setBackgroundFetch = () => {
    BackgroundFetch.configure({
      minimumFetchInterval: 15, // fetch interval in minutes
      enableHeadless: true,
      stopOnTerminate: false,
      periodic: true,
    },
    async taskId => {
      this.getNews()
      BackgroundFetch.finish(taskId);
    },
    error => {
      console.error('RNBackgroundFetch failed to start.');
      },
    );
  }

  showListinButton(){
    if (this.listin) {
      return <Ionicons 
      name="call" 
      onPress={this.goListin}
      size={25} 
      color="white"
      style={styles.navBarButton}
    />
    }
    return null;
  }

  showBarcodeButton(){
    if (this.barcode) {
      return <Ionicons 
       name="barcode" 
       onPress={this.goBarcode}
       size={25} 
       color="white"
       style={styles.navBarButton}
     />;
    }
    return null;
  }

  async setNews(m){
    this.aux_messages = []
    var notified = false
    var notified_messages = await new AsyncStorage.getItem("messages")
    var messages = JSON.parse(notified_messages)
    if (messages != null) {
      await messages.forEach(x => {
        if (x.messages_count == m.messages_count && x.from == m.from) {
          notified = true
        }
      })
    } else {
      messages = []
    }
    if (!notified) {
      this.aux_messages = messages
      this.aux_messages.push(m);
      this.setState({ messages: this.aux_messages })
      await new AsyncStorage.setItem("messages", JSON.stringify(this.aux_messages))
      var result = "mensaje"
      if (m.messages_count > 1) {
        result = "mensajes"
      }
      this.pushNotification("Tienes " + m.messages_count + " " + result + " de " + m.from)
    }
  }

  async checkNews() {
    await this.getUser()
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({aliasDb: this.alias, user: this.user, password: this.password, token:this.token, appSource: "Dicloud"})
    };
    await fetch('https://app.dicloud.es/getPendingNews.asp', requestOptions)
    .then((response) => response.json())
    .then((responseJson) => {
      var messages = responseJson.messages
      if (messages != null) {
        messages.forEach(nx => {
          var m =  {
            from: nx.from,
            from_id: nx.from_id,
            last_message_timestamp: nx.last_message_timestamp,
            messages_count: nx.messages_count,
          }
          this.setNews(m)
        });
      }
    }).catch(() => {});
  }

  async getNews() {
    await AsyncStorage.getItem("notifications").then((value) => {
      if (value == null) {
        value = true
      }
      if (JSON.parse(value)) {
        this.checkNews()
      }
    })
  }

  setWebview =  async () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
 }

  handleBackButton = ()=>{
    if (this.state.canGoBack) {
      this.webView.ref.goBack();
      return true;
    }
    return true;
  }

  goIndex = () => {
    this.setState({ url: "https://desarrollo.dicloud.es/index.asp" })
  }

  goListin = () => {
    this.props.navigation.navigate("Listin")
  }

  goSettings = () => {
    this.props.navigation.navigate("Settings")
  }

  reload = () => {
    this.webView.ref.reload();
  }

  goBarcode = () => {
    this.props.navigation.navigate('Barcode');
  }

  saveLogout =  async (state) => {
    await AsyncStorage.setItem('lastUser', JSON.stringify(false));
    if (!state) {
      await AsyncStorage.setItem('saveData', JSON.stringify(false));
      this.props.navigation.navigate('Login');
    } else {
      await AsyncStorage.setItem('saveData', JSON.stringify(true));
      this.props.navigation.navigate('Login');
    }
  }

  logout = async () => {
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
      Alert.alert(
        "Procedo a desconectar",
        "¿Mantengo tu identificación actual?",
        [
          {
            text: 'Sí',
            onPress: () => {
              resolve(this.saveLogout(true));
            },
          },
          {
            text: 'No',
            onPress: () => {
              resolve(this.saveLogout(false));
            },
          },
          {
            text: 'Cancelar',
            onPress: () => {
              resolve('Cancel');
            },
          },
        ],
        { cancelable: false },
      );
    });
    await AsyncAlert();
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <WebView
          ref={(webView) => { this.webView.ref = webView; }}
          originWhitelist={['*']}
          source={{ uri: this.state.url }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          setSupportMultipleWindows={false}
          allowsBackForwardNavigationGestures
          onNavigationStateChange={(navState) => {
            this.setState({
              canGoBack: navState.canGoBack
            });
          }}
          onError={err => {
            this.setState({ err_code: err.nativeEvent.code })
          }}
          renderLoading={() => 
            <View style={styles.loading}>
            <ActivityIndicator color={'white'} size="large"/>
          </View>}
          renderError={()=> {
            if (this.state.err_code == -2){
              return (
                <View style={{ backgroundColor: "white", flex: 1, height:"100%", width: "100%", position:'absolute', justifyContent: "center", alignItems: "center" }}>
                  <Text>No hay conexión a Internet</Text>
                </View>
              );
            }
          }}
          onShouldStartLoadWithRequest={(event) => {
            if ((event.url.indexOf("agententer.asp") || event.url.indexOf("disconect.asp"))  > -1) {
              this.logout()
              return false
            } else if (event.url.includes("drive:") || event.url.includes("tel:") || event.url.includes("mailto:") || event.url.includes("maps") || event.url.includes("facebook")) {
              Linking.canOpenURL(event.url).then((value) => {
                if (value) {
                  Linking.openURL(event.url)
                }
              })
              return false
            } else {
              this.setState({ url: event.url })  
              return true
            }
          }}
        />
        <View style={styles.navBar}>
          <Ionicons 
            name="reload" 
            onPress={this.reload}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          <Ionicons 
            name="home" 
            onPress={this.goIndex}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          <Ionicons 
            name="settings" 
            onPress={this.goSettings}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
          {this.showListinButton()}
          {this.showBarcodeButton()}
        </View>
    </View>
    )
  }
}

class LoginScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = { hidePassword: true }
  }

  async componentDidMount(){
    const saveData = await AsyncStorage.getItem('saveData').catch(() => {
       saveData = false;
     });
     if (saveData) {
        await AsyncStorage.getItem("alias").then((value) => {
          this.alias = value;
        })
        this.setState({alias:this.alias})
        await AsyncStorage.getItem("user").then((value) => {
          this.user = value;
        })
        this.setState({user:this.user})
        await AsyncStorage.getItem("password").then((value) => {
          this.pass = value;
        })
        this.setState({pass:this.pass})
        await AsyncStorage.getItem("token").then((value) => {
          this.token = value;
        })
        this.setState({token:this.token})
     }
   }

  showAlert = (message) => {
    Alert.alert(
      "Error",
      message,
      [
        {
          text: "Ok",
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  }

  handleError = (error_code) => {
    var error = ""
    switch(error_code) {
      case "1":
        error = "Alias incorrecto"
        break;
      
      case "2":
        error = "Usuario o contraseña incorrectas"
        break;
 
      case "3":
        error = "Este usuario se encuentra desactivado"
        break;
 
      case "4":
        error = "Ha habido algún problema en la comunicación"
        break;
 
      case "5":
        error = "No hay conexión a internet"
        break;

      default:
        error = "Error desconocido"
      }
      this.showAlert(error);
  }

  async goHome(alias,user,pass,fullname,idempresa,token,barcode,listin, userID) {
    await AsyncStorage.setItem('lastUser', JSON.stringify(true));
    await AsyncStorage.setItem('alias', alias);
    await AsyncStorage.setItem('user', user);
    await AsyncStorage.setItem('password', pass);
    await AsyncStorage.setItem('fullname', fullname);
    await AsyncStorage.setItem('listin', listin);
    await AsyncStorage.setItem('idempresa', idempresa + "");
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('barcode', barcode);
    await AsyncStorage.setItem('userID', userID + "");
    var url = "https://desarrollo.dicloud.es/index.asp?company="+alias+"&user="+user+"&pass="+pass.toLowerCase()+"&movil=si"
    this.props.navigation.navigate('Home',{url:url})
  }

  login = () => {
    let alias=this.state.alias;
    let user=this.state.user;
    let pass=this.state.pass;
    if (alias != undefined && user != undefined && pass != undefined) {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({aliasDb: alias, user: user, password: pass, appSource: "Dicloud"})
      };
      fetch('https://app.dicloud.es/login.asp', requestOptions)
        .then((response) => response.json())
        .then((responseJson) => {
          let error = JSON.stringify(responseJson.error_code)
          if (error == 0) {
            let fullname = JSON.parse(JSON.stringify(responseJson.fullName))
            let token = JSON.parse(JSON.stringify(responseJson.token))
            let idempresa = JSON.parse(JSON.stringify(responseJson.companyid))
            let barcode = JSON.parse(JSON.stringify(responseJson.barcode))
            let userID = JSON.parse(JSON.stringify(responseJson.id))
            let listin = JSON.parse(JSON.stringify(responseJson.listin))
            this.goHome(alias,user,pass,fullname,idempresa,token, barcode, listin, userID)
          } else {
            this.handleError(error)
          }
        }).catch(() => {});
    } else {
      this.showAlert("Complete todos los campos")
    }
  }

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  
  render() {
    return (
      <View style={ styles.container }>
        <Image
          style={{ height: 100, width: 100, margin: 10 }}
          source={require('./assets/main.png')}
        />
        <TextInput  
          style = { styles.textBox }
          placeholder="Alias"  
          onChangeText={(alias) => this.setState({alias})}  
          value={this.state.alias}
        /> 
        <TextInput  
          style = { styles.textBox }
          placeholder="Usuario"  
          onChangeText={(user) => this.setState({user})}  
          value={this.state.user}
        /> 
        <View style = { styles.textBoxBtnHolder }>
          <TextInput  
            style = { styles.textBox }
            placeholder="Contraseña"
            secureTextEntry = { this.state.hidePassword }
            onChangeText={(pass) => this.setState({pass})}  
            value={this.state.pass}
          />  
          <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>
            <Ionicons name={ ( this.state.hidePassword ) ? "eye"  : "eye-off" } size={32} color="#98A406" /> 
          </TouchableOpacity>   
        </View>  
        <TouchableOpacity onPress={this.login} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>Entrar</Text>
        </TouchableOpacity>  
        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor:"#337BB7", flexDirection:'row', textAlignVertical: 'center'}}>
        <Text></Text>
        </View>
      </View>
    );
  } 
}

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.init()
  }

  init = async () => {
    const lastUser = await AsyncStorage.getItem('lastUser').catch(() => {
      lastUser = false;
    });
    const alias = await AsyncStorage.getItem('alias').catch(() => {
      alias = "";
    });
    const user = await AsyncStorage.getItem('user').catch(() => {
      user = "";
    });
    const password = await AsyncStorage.getItem('password').catch(() => {
      password = "";
    });
    const token = await AsyncStorage.getItem('token').catch(() => {
      token = "";
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (lastUser != null && lastUser) {
      var url = "https://desarrollo.dicloud.es/?company="+alias+"&user="+user+"&pass="+password.toLowerCase()+"&token="+token
      this.props.navigation.navigate('Home',{url:url})
    } else {
      this.props.navigation.navigate('Login')
    } 
  };

  render(){
    return (
      <View style={styles.mainView}>
      <Image source={require('./assets/main.png')}
        style={{ width: 100, height: 100, alignSelf: "center", marginBottom:20 }}
      />
      <Text style={styles.mainHeader}>Dicloud</Text>
    </View>
    )
  }
}

export class Menu {
  constructor(agent_id, id, menu, submenu, url) {
    this.agent_id = agent_id;
    this.id = id;
    this.menu = menu;
    this.submenu = submenu;
    this.url = url;
  }
}

export class Messages {
  constructor(from_id, from, last_messages_timestamp, messages_count) {
    this.from_id = from_id;
    this.from = from;
    this.last_messages_timestamp = last_messages_timestamp;
    this.messages_count = messages_count;
  }
}

const AppNavigator = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Listin: {
    screen: ListinScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Barcode: {
    screen: BarcodeScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  ExportCodes: {
    screen: ExportCodesScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      header: null,
      animationEnabled: false
    }
  }
});

export class Barcode {
  constructor(quantity, code, time) {
    this.quantity = quantity;
    this.code = code;
    this.time = time;
  }
}

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxBtnHolder:{
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  textBox: {
    fontSize: 18,
    alignSelf: 'stretch',
    height: 45,
    paddingLeft: 8,
    color:"#98A406",
    borderWidth: 2,
    paddingVertical: 0,
    borderColor: '#98A406',
    borderRadius: 0,
    margin: 10,
    borderRadius: 20,
    textAlign: "center"
  },
  visibilityBtn:{
    position: 'absolute',
    right: 20,
    height: 40,
    width: 35,
    padding: 2
  },
  date:{
    color: "#98A406",
    backgroundColor: "white"
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#98A406",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 150,
    margin: 20 
  },
  appButtonBarcodeContainer: {
    elevation: 8,
    backgroundColor: "#1A5276",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'center',
    width: 150,
    margin: 20 
  },
  appButtonText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  appButtonTextDelete: {
    fontSize: 15,
    color: "#922B21",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  appButtonTextTitle: {
    fontSize: 18,
    color: "#1A5276",
    fontWeight: "bold",
    alignSelf: "center"
  },
  appButtonTextSave: {
    fontSize: 15,
    color: "#1A5276",
    fontWeight: "bold",
    alignSelf: "center"
  },
  navBarButton: {
    color: '#FFFFFF',
    textAlign:'center',
    width: 64
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  navBar:{
    flexDirection:'row', 
    textAlignVertical: 'center',
    height: 50,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor:"#1A5276", 
    flexDirection:'row', 
    textAlignVertical: 'center'
  },
  navBarHeader: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: "#1A5276"
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#1A5276"
  },
  mainView: {
    backgroundColor:"#1A5276",
    flex: 1,
    justifyContent: 'center',
  },
  mainHeader: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: "center"
  },
  headerAccounts: {
    color: '#1A5276',
    textAlign:'center',
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    paddingTop: 20,
  },
  checkbox: {
    color: '#1A5276'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
});