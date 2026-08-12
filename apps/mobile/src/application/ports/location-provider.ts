import type { Coords } from "../../domain/geo";

export type LocationGranted = {
  status: "granted";
  coords: Coords;
};

export type LocationDenied = {
  status: "denied";
  canAskAgain: boolean;
};

export type LocationUnavailable = {
  status: "unavailable";
};

export type LocationResult =
  LocationGranted | LocationDenied | LocationUnavailable;

export interface LocationProvider {
  getLocation(): Promise<LocationResult>;
  checkStatus(): Promise<LocationResult>;
}
