import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { canUserReviewBooking } from '../domain/policies';
import { useBookingDetail, useSubmitReview } from '../infrastructure/query/hooks';
import { useAuthSession } from './context/AuthContext';

export function ReviewBookingScreen({ bookingId }: { bookingId: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { actor } = useAuthSession();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const bookingQuery = useBookingDetail(bookingId);
  const submitReview = useSubmitReview();

  if (bookingQuery.isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (bookingQuery.error || !bookingQuery.data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{t('error.unknown')}</Text>
      </View>
    );
  }

  const booking = bookingQuery.data;
  const now = new Date();
  const eligibility = actor
    ? canUserReviewBooking(actor, booking as unknown as import('../domain/actor').BookingForReview, now)
    : { ok: false as const, reason: 'not_your_booking' as const };

  const isBlocked = !eligibility.ok;

  function handleSubmit() {
    if (isBlocked) return;

    const idempotencyKey = `review-${bookingId}-${Date.now()}`;
    submitReview.mutate(
      {
        bookingId,
        input: { rating, comment },
        idempotencyKey,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => {
            router.back();
          }, 1500);
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('review.title')}</Text>

      {/* Symbiosis of Domain Policy + i18n key */}
      {isBlocked ? (
        <View style={styles.blockedBanner} accessibilityRole="alert">
          <Text style={styles.blockedTitle}>🔒 {t('review.blocked.' + eligibility.reason)}</Text>
        </View>
      ) : null}

      {submitted ? (
        <View style={styles.successCard}>
          <Text style={styles.successText}>✅ {t('review.success')}</Text>
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.label}>{t('review.rating')}</Text>
          {/* Star selector */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => !isBlocked && setRating(star)}
                disabled={isBlocked}
                accessibilityRole="button"
                accessibilityLabel={`${star} estrellas`}
                style={styles.starButton}
              >
                <Text style={styles.starIcon}>{star <= rating ? '⭐' : '☆'}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>{t('review.comment')}</Text>
          <TextInput
            style={[styles.textArea, isBlocked && styles.disabledInput]}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            editable={!isBlocked}
            placeholder="..."
          />

          {submitReview.error ? (
            <Text style={styles.errorText}>{t('error.unknown')}</Text>
          ) : null}

          {/* Action button disabled when blocked by domain policy */}
          <Pressable
            style={[styles.submitButton, (isBlocked || submitReview.isPending) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isBlocked || submitReview.isPending}
            accessibilityRole="button"
          >
            {submitReview.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t('review.submit')}</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  blockedBanner: {
    padding: 16,
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  blockedTitle: {
    color: '#991b1b',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  formCard: {
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  starButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 32,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  submitButton: {
    minHeight: 48,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
    opacity: 0.7,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  successCard: {
    padding: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
});
