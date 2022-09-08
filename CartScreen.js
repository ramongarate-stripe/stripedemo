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
  const { cart, addToCart } = useContext(Context);

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
        <Text style={styles.price}>{item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => addToCart(item.id)}
      >
        <Text>Add to cart</Text>
      </TouchableOpacity>
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 5,
    height: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    paddingTop: 10,
  },
  textContainer: {
    flexDirection: "column",
    width: 100,
    alignItems: "left",
    paddingLeft: 10,
    borderRadius: 5,
    height: 50,
  },
});
