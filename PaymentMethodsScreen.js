import { Button, Text, View } from 'react-native'
import { useContext } from 'react';
import { CustomerContext } from './App';

export default function PaymentMethodsScreen() {
    const { customer, setCustomer } = useContext(CustomerContext)
    return (
    <View>
    <Text>{customer}</Text>
    <Button
        variant="primary"
        title="Set Customer"
        onPress={() => {
            setCustomer('customer2')
        }}
    />
    </View>
    );
  }