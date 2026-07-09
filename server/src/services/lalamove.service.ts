import axios from "axios";

type Location = {
  address: string;
  lat: number;
  lng: number;
};

const apiKey = process.env.LALAMOVE_API_KEY || "";
const apiSecret = process.env.LALAMOVE_SECRET_KEY || "";
const apiUrl =
  process.env.LALAMOVE_API_URL || "https://rest.sandbox.lalamove.com/v3";

export const getDeliveryQuote = (pickup: Location, delivery: Location) => {
  const distance = Math.max(
    1,
    Math.sqrt(
      (pickup.lat - delivery.lat) ** 2 + (pickup.lng - delivery.lng) ** 2,
    ) * 111,
  );
  const baseFee = 30000;
  const perKm = 7000;
  const estimatedFee = Math.round(baseFee + distance * perKm);

  return {
    currency: "VND",
    amount: estimatedFee,
    distance: Number(distance.toFixed(2)),
  };
};

export const createLalamoveOrder = async (
  orderDetails: Record<string, any>,
) => {
  if (!apiKey || !apiSecret) {
    throw new Error("Missing Lalamove API credentials");
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const url = `${apiUrl}/orders`;

  const response = await axios.post(url, orderDetails, {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
