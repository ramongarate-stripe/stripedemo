// PaymentMethodsScreen.js
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import { Context } from "../Context";
import { API_URL } from "../constants";
import { PaymentMethodsScreenStyles as styles } from "./styles";

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const CARD_DICT = {
  amex: require("../assets/amex.png"),
  mastercard: require("../assets/mastercard.png"),
  visa: require("../assets/visa.png"),
};

export default function PaymentMethodsScreen() {
  const { customer, setCustomer } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const setDefaultPaymentMethod = async (customerId, paymentMethodId) => {
    const response = await fetch(`${API_URL}/default`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId, paymentMethodId }),
    });
    const customer = await response.json();
    setCustomer(customer);
  };

  const deletePaymentMethod = async (customerId, paymentMethodId) => {
    const response = await fetch(`${API_URL}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId, paymentMethodId }),
    });
    setPaymentMethods(await response.json());
  };

  const login = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const customer = await response.json();
    setCustomer(customer);
    setLoading(false);
  };
  const logout = () => {
    setCustomer(null);
    setPaymentMethods(null);
  };

  const fetchPaymentMethods = async (customer) => {
    const response = await fetch(`${API_URL}/payment_methods/${customer.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPaymentMethods(await response.json());
  };

  useEffect(() => {
    if (customer) {
      fetchPaymentMethods(customer);
    }
  }, [customer]);

  const showAlert = (item) => {
    Alert.alert(capitalize(item.brand), "What would you like to do?", [
      {
        text: "Set as Default",
        onPress: () =>
          setDefaultPaymentMethod(customer.id, item.paymentMethodId),
      },
      {
        text: "Delete Card",
        onPress: () => deletePaymentMethod(customer.id, item.paymentMethodId),
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const openPaymentSheet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/addPaymentMethod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: customer?.id }),
      });
      const { setupIntent, ephemeralKey, customerId } = await response.json();
      const init = await initPaymentSheet({
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntent,
      });
      if (init.error) {
        throw init.error;
      }
      const present = await presentPaymentSheet();
      if (present.error) {
        throw present.error;
      }
      setLoading(false);
      fetchPaymentMethods(customer);
      Alert.alert("Payment Method added");
    } catch (e) {
      setLoading(false);
      console.log(e);
      Alert.alert(`Error: ${JSON.stringify(e)}`);
      return { endpointError: true };
    }
  };

  const Item = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => showAlert(item)}>
      <Image style={styles.image} source={CARD_DICT[item.brand]} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{capitalize(item.brand)}</Text>
        <Text style={styles.last4}>Ending in {item.last4}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.default}>
          {item.paymentMethodId === customer.metadata.default_payment_method
            ? "Default"
            : ""}
        </Text>
        <Image style={styles.menu} source={require("../assets/menu.png")} />
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
          <TouchableOpacity style={styles.item} onPress={openPaymentSheet}>
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
