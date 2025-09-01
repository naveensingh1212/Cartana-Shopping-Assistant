import { useState } from "react";

export default function useShoppingList() {
  const [items, setItems] = useState([]);

  const addItem = (name, qty = 1, category = "other") => {
    setItems((prev) => [...prev, { name, qty, category }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const inc = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const dec = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  return { items, addItem, removeItem, inc, dec, frequentItems: [] };
}
