import { useState, useEffect } from "react";

export default function useShoppingList() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState({});
  const [frequentItems, setFrequentItems] = useState([]);

  // Load state from a persistent storage like local storage
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('shoppingListItems')) || [];
    const storedHistory = JSON.parse(localStorage.getItem('shoppingListHistory')) || {};
    setItems(storedItems);
    setHistory(storedHistory);
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingListItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('shoppingListHistory', JSON.stringify(history));
    // Re-calculate frequent items whenever history changes
    const calculatedFrequent = Object.entries(history)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 5);
    setFrequentItems(calculatedFrequent);
  }, [history]);

  const addItem = (name, qty = 1, category = "Others") => {
    // update cart
    setItems((prev) => {
      const exists = prev.find((i) => i.name === name);
      if (exists) {
        return prev.map((i) =>
          i.name === name ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { name, qty, category }];
    });

    // update frequency history
    setHistory((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1,
    }));
  };

  const removeItem = (name) =>
    setItems((prev) => prev.filter((i) => i.name !== name));

  const inc = (name) =>
    setItems((prev) =>
      prev.map((i) =>
        i.name === name ? { ...i, qty: i.qty + 1 } : i
      )
    );

  const dec = (name) =>
    setItems((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  return { items, addItem, removeItem, inc, dec, frequentItems };
}