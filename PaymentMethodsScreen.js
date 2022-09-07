import { Button, Text, View, TextInput } from "react-native";
import { useState, useContext } from 'react'
import { Context } from './Context'

export default function PaymentMethodsScreen() {
  const { customer, setCustomer } = useContext(Context);
  const [name, setName] = useState('')
  const login = () => {
    setCustomer({
      id: "cus_123545",
      name: "Jane Doe",
    });
  };
  return (
    <View>
      {customer ? (
        <Text>Hello {customer.name}!</Text>
      ) : (
        <View>
          <Text>What is your name?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder='Jane Doe'
          />
          <Button
            variant="primary"
            title="Login"
            onPress={() => {
              login();
            }}
          />
        </View>
      )}
    </View>
  );
}
