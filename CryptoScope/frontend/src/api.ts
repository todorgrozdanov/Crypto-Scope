import axios from "axios";

const API = "https://das-backend-8080.azurewebsites.net/api";

export const fetchCryptos = () => axios.get(`${API}/crypto`);
export const fetchCrypto = (coinGeckoId: string) => axios.get(`${API}/crypto/${coinGeckoId}`);
export const fetchSentiment = () => axios.get(`${API}/sentiment`);