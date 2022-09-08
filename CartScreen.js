import { API_URL } from "./constants";
import { useStripe } from "@stripe/stripe-react-native";
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Context } from "./Context";

export default function CartScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const { cart, addToCart, removeFromCart } = useContext(Context);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (e) {
      console.log(e);
      Alert.alert("Endpoint not responding");
      return { endpointError: true };
    }
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
      endpointError,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    if (!error && !endpointError) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const Item = ({ item, addToCart }) => (
    <View style={styles.item}>
      <Image
        style={styles.image}
        source={{
          uri: item.imageUrl,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{`${item.quantity} x $${item.price}`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToCart(item.id)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} addToCart={addToCart} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cart.filter((item) => item.quantity > 0)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Text>{JSON.stringify(cart)}</Text>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
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
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "black",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 25,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 15,
    paddingTop: 5,
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
