import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useState, useContext, useEffect } from "react";
import { Context } from "./Context";
import { API_URL } from "./constants";

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

  return (
    <View>
      <Text>
        {customer
          ? "Hello " + customer.name
          : "Please click the button to Log In"}
      </Text>
      {!customer ? (
        <TouchableOpacity
          style={styles.loginButton}
          disabled={loading}
          onPress={login}
        >
          <Text style={styles.loginText}>
            {!loading ? "Login" : "Loading..."}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          disabled={loading}
          onPress={logout}
        >
          <Text style={styles.loginText}>
            {!loading ? "Logout" : "Loading..."}
          </Text>
        </TouchableOpacity>
      )}
    </View>
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
});
