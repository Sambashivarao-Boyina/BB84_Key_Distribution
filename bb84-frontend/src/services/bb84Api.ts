import axios from "axios";
import { Basis, Bit } from "@/types/bb84";

// Configure base URL for the FastAPI backend
const API_BASE_URL = "http://localhost:8000"; // Update this to match your backend

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface SendQubitRequest {
  bit: Bit;
  basis: Basis;
}

export interface MeasureQubitRequest {
  basis: Basis;
}

export interface CompareBasesResponse {
  matching_indices: number[];
  alice_key: number[];
  bob_key: number[];
}

export interface FinalKeyResponse {
  shared_key?: string;
  error_rate: number;
  msg?: string;
}

export interface BobMeasureResponse {
  msg: string;
  index: number;
  bob_result: {
    basis: Basis;
    measured: Bit;
  };
}

export class BB84Api {
  static async reset(): Promise<void> {
    await api.post("/reset");
  }

  static async sendQubit(data: SendQubitRequest): Promise<void> {
    await api.post("/alice/send", data);
  }

  static async eveIntercept(index: number): Promise<void> {
    await api.get(`/eve/intercept/${index}`);
  }

  static async bobMeasure(
    index: number,
    data: MeasureQubitRequest
  ): Promise<BobMeasureResponse> {
    const response = await api.post(`/bob/measure/${index}`, data);
    return response.data;
  }
  static async compareBases(): Promise<CompareBasesResponse> {
    const response = await api.get("/compare-bases");
    return response.data;
  }

  static async getFinalKey(): Promise<FinalKeyResponse> {
    const response = await api.get("/final-key");
    return response.data;
  }

  // Health check method
  static async healthCheck(): Promise<boolean> {
    try {
      await api.get("/health");
      return true;
    } catch {
      return false;
    }
  }
}

// Error handler for API calls
export const handleApiError = (error: any): string => {
  if (error.response) {
    return (
      error.response.data?.detail ||
      error.response.data?.message ||
      "Server error occurred"
    );
  } else if (error.request) {
    return "Unable to connect to BB84 backend server. Please ensure it is running on port 8000.";
  } else {
    return "An unexpected error occurred";
  }
};
