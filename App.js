import React, { Component } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Image, Alert, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import { BackHandler } from 'react-native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

class ListinScreen extends Component {

  WEBVIEW_REF = "listin"
  webView = {
    canGoBack: false,
    ref: null,
  }

  constructor(props) {
    super(props);
    this.state = { url: "https://admin.dicloud.es/companies/listin.asp" }
  }

  goHome = () => {
    this.props.navigation.navigate("Home")
  }

  goBarcode = () => {
    this.props.navigation.navigate("Barcode")
  }

  saveLogout =  async (state) => {
    await AsyncStorage.setItem('lastUser', "false");
    if (!state) {
      await AsyncStorage.setItem('saveData', "false");
      this.props.navigation.push('Login');
    } else {
      await AsyncStorage.setItem('saveData', "true");
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
            if (event.url.indexOf("agententer.asp") > -1) {
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
            name="log-out-outline" 
            onPress={this.logout}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
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
            name="barcode" 
            onPress={this.goBarcode}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
        </View>
    </View>
    )
  }
}


class BarcodeScreen extends Component {
  
  aux_barcodes = []
  
  constructor(props) {
    super(props);
    this.state = { barcodes: [Barcode], code: "", quantity: "" };
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

  async setBarcode(b){
    console.log("setNewBarcode="+b.code + " actual="+this.state.code)
    if (b.code == this.state.code) {
      console.log("igual")
      var q = {
        quantity: Number(b.quantity) + Number(this.state.quantity),
        code: b.code
      }
      this.aux_barcodes.push(q);
    } else {
      console.log("distinto")
      this.aux_barcodes.push(b);
    }
  }

  goHome = () => {
    this.props.navigation.navigate("Home")
  }

  goListin = () => {
    this.props.navigation.navigate("Listin")
  }

  saveCode = async () => {
    this.aux_barcodes = []
    var allCodes = this.state.barcodes
    if (this.state.code == "") {
      this.showAlert("El código no puede ser vacío")
    } else {
      allCodes.forEach(x => {
        this.setBarcode(x)
      })
      if (allCodes.length == 0) {
        var b = {
          quantity: this.state.quantity,
          code: this.state.code
        }
        this.setBarcode(b)
      }
    }
    console.log(this.aux_barcodes)
    this.setState({ barcodes: this.aux_barcodes })
    await new AsyncStorage.setItem("barcodes", JSON.stringify(this.aux_barcodes))
    this.codeInput.clear()
    this.quantityInput.clear()
  }

  modifyCode = (item) => {
    this.setState({code: item.code})
    this.setState({quantity: item.quantity + ""})
    this.showAlert("Atención", "Modifique el código, la cantidad o ambos como desee")
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
              resolve(this.removeCode());
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

  saveLogout =  async (state) => {
    await AsyncStorage.setItem('lastUser', "false");
    if (!state) {
      await AsyncStorage.setItem('saveData', "false");
      this.props.navigation.push('Login');
    } else {
      await AsyncStorage.setItem('saveData', "true");
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

  showFlatList(){
    if (this.state.barcodes.length > 0) {
      return <Text style={styles.appButtonTextSave}>Seleccione el código que desee eliminar o editar</Text>
    }
    return null;
 }

  render(){
    return(
      <View style={{flex: 1}}>
        <View style={styles.navBar}>
          <Text style={styles.navBarHeader}>Lector de códigos</Text>
        </View>
        <View style={{flex: 1}}>
        <TextInput ref={input => { this.codeInput = input }} value={this.state.code} placeholder="Escribir código o escanear directamente" style ={{ alignSelf: 'center'}} onChangeText={(code) => this.setState({code})} />
        <TextInput ref={input => { this.quantityInput = input }} value={this.state.quantity} placeholder="Cantidad por defecto: 1" style ={{ alignSelf: 'center'}} onChangeText={(quantity) => this.setState({quantity})} keyboardType="numeric" />
        <TouchableOpacity onPress={this.saveCode}>
          <Text style={styles.appButtonTextSave}>Guardar y seguir</Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress={this.startBarcode} style={styles.appButtonBarcodeContainer}>
          <Text style={styles.appButtonText}>Escanear</Text>
        </TouchableOpacity> 
        {this.showFlatList}
        <FlatList 
        data={ this.state.barcodes } 
        renderItem={({ item, index, separators }) => (
          <TouchableOpacity
            key={item}
            onPress={() => this.askAction(item)}>
            <View> 
              <Text style={styles.headerAccounts}>{item.code} ({item.quantity})</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.user}
        
      />
        </View>
        <View style={styles.navBar}>
        <Ionicons 
            name="log-out-outline" 
            onPress={this.logout}
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
            name="call" 
            onPress={this.goListin}
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
        </View>
        </View>
    )
  }
}

class HomeScreen extends Component { 

  WEBVIEW_REF = "dicloud"
  alias = ""
  user = ""
  password = ""
  fullname = ""
  barcode = false
  token = ""
  webView = {
    canGoBack: false,
    ref: null,
  }
  state = {
    url: ""
  }

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.navigation.state.params.url
    }
    this.setWebview()
    this.getNews()
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
    await AsyncStorage.getItem("token").then((value) => {
      this.token = value;
    })
    await AsyncStorage.getItem("fullname").then((value) => {
      this.fullname = value;
    })
    await AsyncStorage.getItem("barcode").then((value) => {
      this.barcode = value;
    })
  }

  showListinButton(){
    if (this.barcode) {
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
 
  async getNews() {
    await this.getUser()
    var messages = [Messages]
    const response =await axios.post("https://app.dicloud.es/getPendingNews.asp",{"appSource": "Dicloud", "aliasDb": this.alias, "user":this.user, "password": this.password, "token": this.token})
    response.data.messages.forEach(nx => {
      var n =  {
        from_id: nx.from_id,
        from: nx.from,
        last_messages_timestamp: nx.last_messages_timestamp,
        messages_count: nx.messages_count,
      }
      messages.push(n);
    });
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
    this.setState({ url: "https://admin.dicloud.es/index.asp" })
  }

  goListin = () => {
    this.props.navigation.navigate("Listin")
  }

  reload = () => {
    this.webView.ref.reload();
  }

  goBarcode = () => {
    this.props.navigation.push('Barcode');
  }

  saveLogout =  async (state) => {
    await AsyncStorage.setItem('lastUser', "false");
    if (!state) {
      await AsyncStorage.setItem('saveData', "false");
      this.props.navigation.push('Login');
    } else {
      await AsyncStorage.setItem('saveData', "true");
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
            if (event.url.indexOf("agententer.asp") > -1) {
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
            name="log-out-outline" 
            onPress={this.logout}
            size={25} 
            color="white"
            style={styles.navBarButton}
          />
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
       saveData = "false";
     });
     if (saveData == "true") {
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

  async goHome(alias,user,pass,fullname,idempresa,token,barcode) {
    await AsyncStorage.setItem('lastUser', "true");
    await AsyncStorage.setItem('alias', alias);
    await AsyncStorage.setItem('user', user);
    await AsyncStorage.setItem('password', pass);
    await AsyncStorage.setItem('fullname', fullname);
    await AsyncStorage.setItem('idempresa', idempresa + "");
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('barcode', barcode);
    var url = "https://admin.dicloud.es/index.asp?company="+alias+"&user="+user+"&pass="+pass.toLowerCase()+"&movil=si"
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
            let idempresa = JSON.parse(JSON.stringify(responseJson.idempresa))
            let barcode = JSON.parse(JSON.stringify(responseJson.barcode))
            this.goHome(alias,user,pass,fullname,idempresa,token, barcode)
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
      lastUser = "false";
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
    if (lastUser == "true") {
      var url = "https://admin.dicloud.es/?company="+alias+"&user="+user+"&pass="+password.toLowerCase()+"&token="+token
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
      header: null
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null
    }
  },
  Listin: {
    screen: ListinScreen,
    navigationOptions: {
      header: null
    }
  },
  Barcode: {
    screen: BarcodeScreen,
    navigationOptions: {
      header: null
    }
  },
});

export class Barcode {
  constructor(quantity, code) {
    this.quantity = quantity;
    this.code = code;
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
  }
});