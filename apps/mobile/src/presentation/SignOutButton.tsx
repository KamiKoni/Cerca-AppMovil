import { Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSession } from "./SessionProvider";

/**
 * Lives in the group headers, so it is reachable from every screen behind the
 * guard without each one having to place it.
 *
 * There is no confirmation dialog. Signing out costs the user a password to
 * undo, not data, and a prompt on every tap is a worse trade than the rare
 * accidental sign-out it would prevent.
 */
export function SignOutButton() {
  const { t } = useTranslation();
  const { signOut } = useSession();

  return (
    <Pressable
      onPress={() => {
        // Only the keystore can reject now — the server call is best effort —
        // and there is nothing the user could do about that. Swallowing it here
        // keeps a rare failure from surfacing as an unhandled rejection; the
        // session is left intact rather than pretending it ended.
        void signOut().catch(() => {});
      }}
      accessibilityRole="button"
      accessibilityLabel={t("session.signOut")}
      hitSlop={8}
      style={{ paddingHorizontal: 8 }}
    >
      <Text style={{ color: "#c00", fontWeight: "600" }}>
        {t("session.signOut")}
      </Text>
    </Pressable>
  );
}
