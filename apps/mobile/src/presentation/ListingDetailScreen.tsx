import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatMoney, type Money, type PricingSchemaType } from '@cerca/contract';
import { ApiError } from '../domain/errors';
import type { ListingId } from '../domain/ids';
import { useListingDetail } from '../infrastructure/query/hooks';

const LOCALE = 'es-CO';

export function ListingDetailScreen({ id }: { id: ListingId }) {
  const { t } = useTranslation();
  const detail = useListingDetail(id);

  if (detail.isPending) return <ActivityIndicator style={{ marginTop: 32 }} />;

  if (detail.error) {
    return <Text style={{ color: '#c00', padding: 16 }}>{describe(detail.error, t)}</Text>;
  }

  const listing = detail.data;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>{listing.title}</Text>

      <Text style={{ fontSize: 18, marginTop: 8 }}>{describePricing(listing.pricing, t)}</Text>

      {listing.ratingCount > 0 ? (
        <Text style={{ color: '#666', marginTop: 4 }}>
          {listing.ratingAvg.toFixed(1)} ({listing.ratingCount})
        </Text>
      ) : (
        <Text style={{ color: '#666', marginTop: 4 }}>{t('listing.noReviews')}</Text>
      )}

      <Text style={{ marginTop: 16, lineHeight: 22 }}>{listing.description}</Text>
    </ScrollView>
  );
}

/**
 * The three pricing models read differently to a user: a fixed price is a
 * number, an hourly rate is a rate plus a minimum, and a quote may have no
 * number at all. Flattening them to one line would hide the minimum, which is
 * exactly the part that surprises people on the invoice.
 */
function describePricing(pricing: PricingSchemaType, t: (key: string) => string): string {
  if (pricing.model === 'fixed') return formatMoney(pricing.price, LOCALE);

  if (pricing.model === 'hourly') {
    const rate = formatMoney(pricing.hourlyRate as Money, LOCALE);
    return `${rate}${t('listing.perHour')} · ${t('listing.minimum')} ${pricing.minimumHours}h`;
  }

  return pricing.startingFrom
    ? `${t('listing.from')} ${formatMoney(pricing.startingFrom, LOCALE)}`
    : t('listing.onQuote');
}

function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    if (error.kind === 'network') return t('error.network');
    if (error.kind === 'not_found') return t('listing.notFound');
  }
  return t('error.unknown');
}
