import * as Location from 'expo-location';
import { Platform, Linking } from 'react-native';
import type { LocationProvider, LocationResult } from '../../application/ports/location-provider';
import type { Coords } from '../../domain/geo';

function toCoords(location: Location.LocationObject): Coords {
  return { lat: location.coords.latitude, lng: location.coords.longitude };
}

function mapPermission(status: Location.PermissionStatus): LocationResult['status'] {
  if (status === Location.PermissionStatus.GRANTED) {
    return 'granted';
  }

  if (status === Location.PermissionStatus.DENIED || status === Location.PermissionStatus.UNDETERMINED) {
    return 'denied';
  }

  return 'unavailable';
}

function mapDeniedStatus(status: Location.PermissionStatus): boolean {
  return status !== Location.PermissionStatus.UNDETERMINED;
}

export class ExpoLocationAdapter implements LocationProvider {
  async getLocation(): Promise<LocationResult> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const normalizedStatus = mapPermission(status);

      if (normalizedStatus !== 'granted') {
        return {
          status: normalizedStatus,
          canAskAgain: status === Location.PermissionStatus.UNDETERMINED,
        };
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      return { status: 'granted', coords: toCoords(location) };
    } catch {
      return { status: 'unavailable' };
    }
  }

  async checkStatus(): Promise<LocationResult> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const normalizedStatus = mapPermission(status);
      if (normalizedStatus !== 'granted') {
        return {
          status: normalizedStatus,
          canAskAgain: status === Location.PermissionStatus.UNDETERMINED,
        };
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      return { status: 'granted', coords: toCoords(location) };
    } catch {
      return { status: 'unavailable' };
    }
  }
}

export function openSettings(): void {
  const url = Platform.select({
    ios: 'app-settings:',
    android: 'app-settings:',
  });

  if (url) {
    Linking.openSettings().catch(() => undefined);
  }
}
