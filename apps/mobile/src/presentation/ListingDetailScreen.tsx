import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { formatMoney, type ListingDetail, type Money, type PricingSchemaType } from '@cerca/contract';
import { canEditOwnListing } from '../domain/actor';
import { ApiError } from '../domain/errors';
import type { ListingId } from '../domain/ids';
import { useCreateBooking, useListingDetail, useToggleFavorite } from '../infrastructure/query/hooks';
import { useAuthSession } from './context/AuthContext';

export function ListingDetailScreen({ id }: { id: ListingId }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { actor } = useAuthSession();
  const locale = i18n.language || 'es-CO';

  const detail = useListingDetail(id);
  const toggleFavorite = useToggleFavorite();
  const createBooking = useCreateBooking();

  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (detail.isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (detail.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{describe(detail.error, t)}</Text>
      </View>
    );
  }

  const listing = detail.data as ListingDetail & { isFavorite?: boolean };
  const isOwner = actor ? canEditOwnListing(actor, listing) : false;

  function handleRequestBooking() {
    const idempotencyKey = `booking-${listing.id}-${Date.now()}`;
    createBooking.mutate(
      {
        input: {
          listingId: listing.id,
          notes: bookingNotes,
        },
        idempotencyKey,
      },
      {
        onSuccess: () => {
          setBookingSuccess(true);
          setTimeout(() => {
            setBookingModalVisible(false);
            setBookingSuccess(false);
            setBookingNotes('');
          }, 1500);
        },
      },
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Title & Status Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{listing.title}</Text>
        {listing.status !== 'published' ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {t(`listing.status.${listing.status}`, listing.status)}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Pricing Information */}
      <View style={styles.pricingCard}>
        <Text style={styles.pricingText}>{describePricing(listing.pricing, locale, t)}</Text>
      </View>

      {/* Rating & Reviews */}
      <View style={styles.ratingRow}>
        {listing.ratingCount > 0 ? (
          <Text style={styles.ratingText}>
            ⭐ {listing.ratingAvg.toFixed(1)} (
            {t('listing.reviewsCount', { count: listing.ratingCount })})
          </Text>
        ) : (
          <Text style={styles.ratingText}>{t('listing.noReviews')}</Text>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description}>{listing.description}</Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Owner Edit Guard (US-04) */}
        {isOwner ? (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push(`/listings/${listing.id}/edit` as never)}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>✏️ {t('listing.edit')}</Text>
          </Pressable>
        ) : null}

        {/* Customer Booking Request Button (US-05) */}
        {!isOwner && actor ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() => setBookingModalVisible(true)}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>📅 {t('listing.book')}</Text>
          </Pressable>
        ) : null}

        {/* Favorite Toggle Button */}
        {actor ? (
          <Pressable
            style={styles.favoriteButton}
            onPress={() =>
              toggleFavorite.mutate({ id: listing.id, next: !listing.isFavorite })
            }
            accessibilityRole="button"
          >
            <Text style={styles.favoriteButtonText}>
              {listing.isFavorite ? '❤️ Guardado' : '🤍 Guardar en favoritos'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Booking Request Modal (US-05) */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('listing.book')}</Text>
            <Text style={styles.modalSubtitle}>{listing.title}</Text>

            {bookingSuccess ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅ {t('listing.bookingRequested')}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.label}>{t('booking.notes')}</Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={4}
                  placeholder="Detalles sobre el servicio que requieres..."
                  value={bookingNotes}
                  onChangeText={setBookingNotes}
                />

                {createBooking.error ? (
                  <Text style={styles.errorText}>{describe(createBooking.error, t)}</Text>
                ) : null}

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={() => setBookingModalVisible(false)}
                    disabled={createBooking.isPending}
                  >
                    <Text style={styles.modalCancelText}>{t('provider.back')}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.primaryButton, createBooking.isPending && styles.disabledButton]}
                    onPress={handleRequestBooking}
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryButtonText}>{t('booking.submit')}</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function describePricing(
  pricing: PricingSchemaType,
  locale: string,
  t: (key: string) => string,
): string {
  if (pricing.model === 'fixed') return formatMoney(pricing.price, locale);

  if (pricing.model === 'hourly') {
    const rate = formatMoney(pricing.hourlyRate as Money, locale);
    return `${rate} ${t('listing.perHour')} · ${t('listing.minimum')} ${pricing.minimumHours}h`;
  }

  return pricing.startingFrom
    ? `${t('listing.from')} ${formatMoney(pricing.startingFrom, locale)}`
    : t('listing.onQuote');
}

function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    if (error.kind === 'network') return t('error.network');
    if (error.kind === 'not_found') return t('listing.notFound');
  }
  return t('error.unknown');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  pricingCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    marginVertical: 12,
  },
  pricingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#15803d',
  },
  ratingRow: {
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 15,
    color: '#4b5563',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 24,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    minHeight: 48,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    minHeight: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#4b5563',
    fontWeight: '600',
  },
  successBox: {
    padding: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
});
