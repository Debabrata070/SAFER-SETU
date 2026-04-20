import { API_BASE_URL } from "../config/apiBase.js";

async function readJsonOrText(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || res.statusText };
  }
}

export const getRazorpayCheckoutKeyId = async () => {
  const res = await fetch(`${API_BASE_URL}/api/payment/checkout-config`);
  const body = await readJsonOrText(res);
  if (!res.ok) {
    throw new Error(
      body.error ||
        `GET ${API_BASE_URL}/api/payment/checkout-config failed (${res.status})`
    );
  }
  if (!body.keyId) {
    throw new Error("checkout-config response missing keyId");
  }
  return body.keyId;
};

export const createOrder = async (amount) => {
  const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const body = await readJsonOrText(res);
  if (!res.ok) {
    const main = body.error || body.message || `Create order failed (${res.status})`;
    const hint = body.hint ? `\n\n${body.hint}` : "";
    throw new Error(main + hint);
  }
  return body;
};

export const verifyPayment = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await readJsonOrText(res);
  if (!res.ok) {
    throw new Error(body.error || body.message || `Verify failed (${res.status})`);
  }
  return body;
};

export const getUserPayments = async (email) => {
  const res = await fetch(`${API_BASE_URL}/api/payment/user/${email}`);
  return res.json();
};


export const refundPayment = async (paymentId) => {
  const res = await fetch(
    `${API_BASE_URL}/api/payment/refund/${paymentId}`,
    {
      method: "PUT",
    }
  );

  return res.json();
};