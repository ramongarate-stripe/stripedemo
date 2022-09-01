import { Button, Text, View } from 'react-native'
import { useContext } from 'react'
import { CustomerContext } from './App'

export default function ShopScreen({ navigation }) {
    const { customer, setCustomer } = useContext(CustomerContext)
    return (
        <View>
    <Text>Hello {customer}</Text>
    </View>
    );
  }