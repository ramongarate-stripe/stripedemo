import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { Context } from "./Context";
import { API_URL } from "./constants";

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const CARD_DICT = {
  amex: require("./assets/amex.png"),
  mastercard: require("./assets/mastercard.png"),
  visa: require("./assets/visa.png"),
};

export default function PaymentMethodsScreen() {
  const { customer, setCustomer } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(null);

  const login = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const customer = await response.json();
    console.log(customer.name);
    setCustomer(customer);
    setLoading(false);
  };
  const logout = () => {
    setCustomer(null);
    setPaymentMethods(null);
  };

  useEffect(() => {
    if (customer) {
      const fetchPaymentMethods = async () => {
        const response = await fetch(`${API_URL}/payment_methods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerId: customer.id }),
        });
        const paymentMethodsResponse = await response.json();
        setPaymentMethods(paymentMethodsResponse.data.map((pm) => pm.card));
        console.log(paymentMethods);
      };
      fetchPaymentMethods();
    }
  }, [customer]);

  const showAlert = (item) => {
    Alert.alert(capitalize(item.brand), "What would you like to do?", [
      {
        text: "Set as Default",
        onPress: () =>
          Alert.alert(
            `${capitalize(item.brand)} ending in ${
              item.last4
            } is now the default payment method`
          ),
      },
      {
        text: "Delete Card",
        onPress: () =>
          Alert.alert(
            `${capitalize(item.brand)} ending in ${item.last4} deleted`
          ),
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const Item = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => showAlert(item)}>
      <Image style={styles.image} source={CARD_DICT[item.brand]} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{capitalize(item.brand)}</Text>
        <Text style={styles.last4}>Ending in {item.last4}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.default}>Default</Text>
        <Image style={styles.menu} source={require("./assets/menu.png")} />
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView>
      <Text style={styles.customerText}>
        {customer
          ? "Logged in as: " + customer.name
          : "Please click the button to Log In"}
      </Text>
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item) => item.fingerprint}
      />
      {!customer ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.loginButton}
            disabled={loading}
            onPress={login}
          >
            <Text style={styles.loginText}>
              {!loading ? "Login" : "Loading..."}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.item}
            onPress={() => console.log("click")}
          >
            <Text style={styles.plusText}>+</Text>
            <Text style={styles.addText}>Add Payment Method</Text>
          </TouchableOpacity>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.loginButton}
              disabled={loading}
              onPress={logout}
            >
              <Text style={styles.loginText}>
                {!loading ? "Logout" : "Loading..."}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    backgroundColor: "black",
    borderRadius: 5,
    marginBottom: 50,
  },
  loginText: {
    fontSize: 20,
    color: "white",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
  },
  image: {
    width: 64,
    height: 36,
    borderRadius: 5,
  },
  menu: {
    width: 30,
    height: 20,
  },
  container: {
    marginTop: StatusBar.currentHeight || 0,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  totalAmount: {
    fontSize: 20,
    margin: 20,
  },
  checkoutButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    backgroundColor: "black",
    borderRadius: 5,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 40,
    color: "white",
  },
  plusText: {
    fontSize: 20,
    fontWeight: "bold",
    width: 64,
    textAlign: "center",
  },
  addText: {
    fontSize: 20,
    paddingLeft: 10,
  },
  customerText: {
    fontSize: 15,
    width: "100%",
    padding: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantity: {
    padding: 10,
    fontSize: 20,
  },
  textContainer: {
    flexDirection: "column",
    width: 140,
    alignItems: "left",
    paddingLeft: 10,
    borderRadius: 5,
    height: 50,
  },
});
