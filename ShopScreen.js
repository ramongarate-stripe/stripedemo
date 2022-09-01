import { Button, Text, View } from "react-native";
import { useAuth } from "./Auth";

export default function ShopScreen({ navigation }) {
  const { customer, setCustomer } = useAuth();
  return (
    <View>
      <Text>Hello {customer}</Text>
    </View>
  );
}
