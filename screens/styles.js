// styles.js
import { StyleSheet, StatusBar } from "react-native";

export const ShopScreenStyles = StyleSheet.create({
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

export const CartScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    alignItems: "center",
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

export const PaymentMethodsScreenStyles = StyleSheet.create({
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
  default: {
    fontSize: 20,
    width: 80,
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
  textContainer: {
    flexDirection: "column",
    width: 140,
    alignItems: "left",
    paddingLeft: 10,
    borderRadius: 5,
    height: 50,
  },
});
