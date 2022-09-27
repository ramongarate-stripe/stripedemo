// CartScreen.js
import { API_URL } from "../constants";
import { useStripe } from "@stripe/stripe-react-native";
import { useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { CartScreenStyles as styles } from "./styles";
import { Context } from "../Context";

export default function CartScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const { cart, addToCart, removeFromCart, emptyCart, customer } =
    useContext(Context);
  const totalAmount = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const openPaymentSheet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount, customerId: customer?.id }),
      });
      const { paymentIntent, ephemeralKey, customerId } = await response.json();
      const init = await initPaymentSheet({
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
      });
      if (init.error) {
        throw init.error;
      }
      const present = await presentPaymentSheet();
      if (present.error) {
        throw present.error;
      }
      setLoading(false);
      emptyCart();
      Alert.alert("Purchase successful!");
    } catch (e) {
      setLoading(false);
      console.log(e);
      Alert.alert(`Error: ${JSON.stringify(e)}`);
      return { endpointError: true };
    }
  };

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
          onPress={() => removeFromCart(item)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
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
      <Text style={styles.totalAmount}>
        {totalAmount > 0 ? "Total: $" + totalAmount : "Your cart is empty"}
      </Text>
      <TouchableOpacity
        style={styles.checkoutButton}
        disabled={loading}
        onPress={openPaymentSheet}
      >
        <Text style={styles.buttonText}>
          {!loading ? "Checkout" : "Loading..."}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
