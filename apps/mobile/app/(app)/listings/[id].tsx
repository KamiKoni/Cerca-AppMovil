import { Text, View } from 'react-native';
import { useSearchParams } from 'expo-router';

export default function ListingDetailPage() {
  const { id } = useSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Listing detail: {id}</Text>
    </View>
  );
}
