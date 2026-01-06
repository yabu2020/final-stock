import { useEffect, useState } from "react";
import axios from "axios";

function FlourStock() {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    axios.get("/api/flour-stock")
      .then(res => setStock(res.data.totalKg || 0));
  }, []);

  return <h2>Flour Stock: {stock} KG</h2>;
}

export default FlourStock;