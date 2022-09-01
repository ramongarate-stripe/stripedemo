import { useState, createContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopScreen from './ShopScreen';
import CartScreen from './CartScreen';
import PaymentMethodsScreen from './PaymentMethodsScreen';
import { StripeProvider } from '@stripe/stripe-react-native';
export const CustomerContext = createContext(null);
import { PUBLISHABLE_KEY } from './constants'

const Tab = createBottomTabNavigator();

export default function App() {
  const [customer, setCustomer] = useState('customer1')
  return (
    <StripeProvider
      publishableKey={PUBLISHABLE_KEY}
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <NavigationContainer>
      <CustomerContext.Provider value={{customer, setCustomer}}>
        <Tab.Navigator>
          <Tab.Screen name="Shop" component={ShopScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Payment Methods" component={PaymentMethodsScreen} />
        </Tab.Navigator>
        </CustomerContext.Provider>
      </NavigationContainer>
    </StripeProvider>
  );
}