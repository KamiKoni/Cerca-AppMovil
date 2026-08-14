import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  toBooking,
  type Booking,
  type BookingResponse,
  type DeclineReason,
} from "@cerca/contract";
import {
  availableActions,
  isTerminal,
  type BookingAction,
} from "../domain/booking-transitions";
import { isSchedulable, scheduleSlots } from "../domain/booking-schedule";
import { ApiError } from "../domain/errors";
import {
  useAcceptBooking,
  useBookings,
  useCancelBooking,
  useCompleteBooking,
  useDeclineBooking,
  useMyListings,
} from "../infrastructure/query/hooks";
import { useLocaleTag } from "./useLocaleTag";
import { withCapacity } from "./authorization";

const DECLINE_REASONS: DeclineReason[] = ["unavailable", "not_a_fit", "other"];

export function ProviderBookingsScreen() {
  const { t } = useTranslation();
  const locale = useLocaleTag();
  const isProvider = withCapacity("provider");

  const bookings = useBookings("provider");
  // One request for the whole list rather than one per row: the provider's own
  // listings are already cached by the my-listings screen, and the bookings
  // endpoint sends a listingId without a title.
  const listings = useMyListings();

  const accept = useAcceptBooking();
  const decline = useDeclineBooking();
  const complete = useCompleteBooking();
  const cancel = useCancelBooking();

  const [pending, setPending] = useState<PendingAction | null>(null);

  const titles = useMemo(() => {
    const byId = new Map<string, string>();
    for (const listing of listings.data ?? []) byId.set(listing.id, listing.title);
    return byId;
  }, [listings.data]);

  const items = useMemo(() => {
    const rows =
      bookings.data?.pages.flatMap((page: { items: BookingResponse[] }) =>
        page.items.map(toBooking),
      ) ?? [];

    // Live requests first, finished ones after. Someone opening this screen is
    // here to answer something, not to read history.
    return [...rows].sort(
      (a, b) => Number(isTerminal(a.status)) - Number(isTerminal(b.status)),
    );
  }, [bookings.data]);

  if (!isProvider) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>{t("bookings.providerOnly")}</Text>
      </View>
    );
  }

  if (bookings.isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (bookings.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{describe(bookings.error, t)}</Text>
      </View>
    );
  }

  const busy =
    accept.isPending ||
    decline.isPending ||
    complete.isPending ||
    cancel.isPending;

  function run(action: BookingAction, booking: Booking) {
    // Accepting and declining need an answer from the provider first; the other
    // two are the whole instruction.
    if (action === "accept" || action === "decline") {
      setPending({ action, bookingId: booking.id });
      return;
    }

    // Kept apart rather than picked into a variable: the two mutations take
    // different arguments, and collapsing them would need a cast that hides
    // exactly that.
    if (action === "complete") complete.mutate(booking.id);
    else cancel.mutate({ id: booking.id });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(booking) => booking.id}
        contentContainerStyle={items.length === 0 ? styles.center : undefined}
        renderItem={({ item }) => (
          <BookingRow
            booking={item}
            title={titles.get(item.listingId)}
            locale={locale}
            busy={busy}
            onAction={run}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("bookings.empty")}</Text>
        }
        onEndReached={() => {
          if (bookings.hasNextPage && !bookings.isFetchingNextPage)
            bookings.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          bookings.isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} />
          ) : null
        }
      />

      <AcceptSheet
        visible={pending?.action === "accept"}
        locale={locale}
        onCancel={() => setPending(null)}
        onPick={(scheduledFor) => {
          if (!pending) return;
          accept.mutate({ id: pending.bookingId, scheduledFor });
          setPending(null);
        }}
      />

      <DeclineSheet
        visible={pending?.action === "decline"}
        onCancel={() => setPending(null)}
        onPick={(reason) => {
          if (!pending) return;
          decline.mutate({ id: pending.bookingId, reason });
          setPending(null);
        }}
      />
    </View>
  );
}

interface PendingAction {
  readonly action: "accept" | "decline";
  readonly bookingId: string;
}

function BookingRow({
  booking,
  title,
  locale,
  busy,
  onAction,
}: {
  booking: Booking;
  title: string | undefined;
  locale: string;
  busy: boolean;
  onAction: (action: BookingAction, booking: Booking) => void;
}) {
  const { t } = useTranslation();

  // The list of buttons is derived from the state, never hardcoded: a declined
  // booking offers nothing, and a completed one cannot be accepted again.
  const actions = availableActions(booking.status, "provider");

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {title ?? t("bookings.unknownListing")}
      </Text>
      <View style={styles.statusRow}>
        <Text style={[styles.badge, badgeStyle(booking.status.kind)]}>
          {t(`booking.status.${booking.status.kind}`)}
        </Text>
        <Text style={styles.when}>{describeWhen(booking, locale, t)}</Text>
      </View>

      {actions.length > 0 ? (
        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action}
              style={[
                styles.actionButton,
                action === "decline" || action === "cancel"
                  ? styles.destructive
                  : null,
                busy ? styles.disabled : null,
              ]}
              onPress={() => onAction(action, booking)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={t(`booking.${action}`)}
            >
              <Text
                style={[
                  styles.actionText,
                  action === "decline" || action === "cancel"
                    ? styles.destructiveText
                    : null,
                ]}
              >
                {t(`booking.${action}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function AcceptSheet({
  visible,
  locale,
  onCancel,
  onPick,
}: {
  visible: boolean;
  locale: string;
  onCancel: () => void;
  onPick: (scheduledFor: string) => void;
}) {
  const { t } = useTranslation();

  // Recomputed on every open rather than held in state: a sheet opened at
  // 23:58 and answered at 00:02 would otherwise offer yesterday's slots.
  const now = new Date();
  const slots = visible ? scheduleSlots(now) : [];

  return (
    <Sheet visible={visible} title={t("booking.chooseDate")} onCancel={onCancel}>
      {slots
        .filter((slot) => isSchedulable(slot.iso, now))
        .map((slot) => (
          <Pressable
            key={slot.iso}
            style={styles.sheetOption}
            onPress={() => onPick(slot.iso)}
            accessibilityRole="button"
          >
            <Text style={styles.sheetOptionText}>
              {formatDateTime(slot.iso, locale)}
            </Text>
          </Pressable>
        ))}
    </Sheet>
  );
}

function DeclineSheet({
  visible,
  onCancel,
  onPick,
}: {
  visible: boolean;
  onCancel: () => void;
  onPick: (reason: DeclineReason) => void;
}) {
  const { t } = useTranslation();

  return (
    <Sheet
      visible={visible}
      title={t("booking.chooseReason")}
      onCancel={onCancel}
    >
      {DECLINE_REASONS.map((reason) => (
        <Pressable
          key={reason}
          style={styles.sheetOption}
          onPress={() => onPick(reason)}
          accessibilityRole="button"
        >
          <Text style={styles.sheetOptionText}>
            {t(`booking.declineReason.${reason}`)}
          </Text>
        </Pressable>
      ))}
    </Sheet>
  );
}

function Sheet({
  visible,
  title,
  onCancel,
  children,
}: {
  visible: boolean;
  title: string;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>
          {children}
          <Pressable
            style={styles.sheetCancel}
            onPress={onCancel}
            accessibilityRole="button"
          >
            <Text style={styles.sheetCancelText}>{t("booking.back")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * The date that matters for this state: when it is scheduled once accepted,
 * when it finished once completed, when it was asked for otherwise.
 */
function describeWhen(
  booking: Booking,
  locale: string,
  t: (key: string, options?: Record<string, string>) => string,
): string {
  switch (booking.status.kind) {
    case "accepted":
      return t("booking.scheduledOn", {
        date: formatDateTime(booking.status.scheduledFor, locale),
      });
    case "completed":
      return t("booking.completedOn", {
        date: formatDateTime(booking.status.completedAt, locale),
      });
    case "requested":
      return t("booking.requestedOn", {
        date: formatDateTime(booking.status.requestedAt, locale),
      });
    default:
      return "";
  }
}

function formatDateTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function badgeStyle(kind: Booking["status"]["kind"]) {
  switch (kind) {
    case "requested":
      return styles.badgeRequested;
    case "accepted":
      return styles.badgeAccepted;
    case "completed":
      return styles.badgeCompleted;
    default:
      return styles.badgeEnded;
  }
}

function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError && error.kind === "network")
    return t("error.network");
  return t("error.unknown");
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  badgeRequested: { backgroundColor: "#fef3c7", color: "#92400e" },
  badgeAccepted: { backgroundColor: "#dbeafe", color: "#1e40af" },
  badgeCompleted: { backgroundColor: "#dcfce7", color: "#166534" },
  badgeEnded: { backgroundColor: "#f3f4f6", color: "#6b7280" },
  when: { color: "#6b7280", fontSize: 13, flexShrink: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionButton: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  actionText: { color: "#2563eb", fontWeight: "600" },
  destructive: { borderColor: "#dc2626" },
  destructiveText: { color: "#dc2626" },
  disabled: { opacity: 0.5 },
  emptyText: { color: "#6b7280", fontSize: 15, textAlign: "center" },
  errorText: { color: "#dc2626", fontSize: 15, textAlign: "center" },
  footer: { margin: 16 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  sheetOption: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  sheetOptionText: { fontSize: 16, color: "#111827" },
  sheetCancel: { minHeight: 48, justifyContent: "center", alignItems: "center" },
  sheetCancelText: { color: "#6b7280", fontWeight: "600" },
});
