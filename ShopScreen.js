import React from "react";
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

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Sofa",
    price: 1000,
    imageUrl: "https://reactnative.dev/img/tiny_logo.png",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Chair",
    price: 100,
    imageUrl: "https://reactnative.dev/img/tiny_logo.png",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Desk",
    price: 500,
    imageUrl: "https://reactnative.dev/img/tiny_logo.png",
  },
];

const Item = ({ title, price, imageUrl }) => (
  <View style={styles.item}>
    <Image
      style={styles.image}
      source={{
        uri: imageUrl,
      }}
    />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={() => console.log("hi")}>
      <Text>Add to cart</Text>
    </TouchableOpacity>
  </View>
);

const ShopScreen = () => {
  const renderItem = ({ item }) => (
    <Item title={item.title} price={item.price} imageUrl={item.imageUrl} />
  );

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
