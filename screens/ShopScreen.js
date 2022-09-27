// ShopScreen.js
import { useContext } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Context } from "../Context";
import { DATA } from "../constants";
import { ShopScreenStyles as styles } from "./styles";

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
      <Text style={styles.price}>${item.price}</Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
      <Text>Add to cart</Text>
    </TouchableOpacity>
  </View>
);

export default function ShopScreen() {
  const { addToCart } = useContext(Context);
  const renderItem = ({ item }) => <Item item={item} addToCart={addToCart} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
