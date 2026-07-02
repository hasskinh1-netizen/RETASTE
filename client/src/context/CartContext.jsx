import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const normalizeCartItem = (item) => {
  if (!item) return null;

  return {
    product_id:
      item.product_id || item.id || item.productId || item._id || null,
    product_name:
      item.product_name || item.name || item.productName || item.comboName || "",
    base_price:
      item.base_price ?? item.basePrice ?? item.price ?? item.combo_price ?? item.comboPrice ?? 0,
    image_url: item.image_url || item.image || item.imageUrl || "",
    quantity: item.quantity ?? item.qty ?? 1,
    selectedSize:
      item.selectedSize ?? item.size_id ?? item.size ?? item.sizeId ?? null,
  };
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(normalizeCartItem)
        .filter((item) => item && item.product_id && item.base_price != null && item.quantity > 0);
    } catch {
      return [];
    }
  });

  // Save lên localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    setCartItems((prevItems) => {
      // Tìm item có cùng product_id và size
      const normalizedProduct = normalizeCartItem({
        ...product,
        quantity,
        selectedSize,
      });

      const existingItem = prevItems.find(
        (item) =>
          item.product_id === normalizedProduct.product_id &&
          item.selectedSize === normalizedProduct.selectedSize
      );

      if (existingItem) {
        // Tăng số lượng nếu sản phẩm đã có
        return prevItems.map((item) =>
          item.product_id === normalizedProduct.product_id &&
          item.selectedSize === normalizedProduct.selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Thêm mới
        return [...prevItems, normalizedProduct];
      }
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product_id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.base_price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
