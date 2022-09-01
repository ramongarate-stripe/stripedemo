import { Button, Text, View } from "react-native";
import { useAuth } from "./Auth";

export default function PaymentMethodsScreen() {
  const { customer, setCustomer } = useAuth();
  return (
    <View>
      <Text>{customer}</Text>
      <Button
        variant="primary"
        title="Set Customer"
        onPress={() => {
          setCustomer("customer2");
        }}
      />
    </View>
  );
}
