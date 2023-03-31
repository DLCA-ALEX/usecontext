import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextData>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const itemIndex = cart.findIndex((item) => item.product.id === product.id);

    if (itemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.product.id !== id);
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

const App = () => {
  return (
    <CartProvider>
      <View style={styles.container}>
        <ProductList />
        <Cart />
      </View>
    </CartProvider>
  );
};

const ProductList = () => {
  const products: Product[] = [
    { id: 1, name: 'Producto 1', price: 10 },
    { id: 2, name: 'Producto 2', price: 20 },
    { id: 3, name: 'Producto 3', price: 30 },
  ];

  return (
    <View>
      <Text style={styles.heading}>Productos</Text>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </View>
  );
};

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <View style={styles.product}>
      <Text style={styles.text}>{product.name}</Text>
      <Text style={styles.text}>${product.price}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </TouchableOpacity>
    </View>
  );
};

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const handleRemoveFromCart = (id: number) => {
    removeFromCart(id);
  };

  return (
    <View style={styles.cart}>
      <Text style={styles.heading}>Carrito</Text>
      {cart.length === 0 ? (
        <Text>Tu carro esta vacio</Text>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} onRemove={handleRemoveFromCart} />
          ))}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

interface CartItemProps {
  item: CartItem;
  onRemove: (id: number) => void;
}

const CartItem = ({ item, onRemove }: CartItemProps) => {
  return (
    <View style={styles.cartItem}>
      <Text style={styles.text}>
        {item.product.name} ({item.quantity})
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => onRemove(item.product.id)}>
        <Text style={styles.buttonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  product: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cart: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    paddingTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default App;