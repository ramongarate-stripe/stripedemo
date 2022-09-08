import { useContext } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Context } from "./Context";
import { DATA } from "./constants";

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
    <TouchableOpacity style={styles.button} onPress={() => addToCart(item.id)}>
      <Text>Add to cart</Text>
    </TouchableOpacity>
  </View>
);

const ShopScreen = () => {
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
};

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

export default ShopScreen;
