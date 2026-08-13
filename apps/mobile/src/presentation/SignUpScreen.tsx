import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@cerca/contract";
import { ApiError } from "../domain/errors";
import { useSignUp } from "../infrastructure/query/hooks";
import { useSession } from "./SessionProvider";

/**
 * The contract's schema minus the field the form does not ask for.
 *
 * Everyone signs up as a customer; becoming a provider happens later, from
 * inside the app (US-17). Asking at registration would make people choose a
 * role before they have seen what either one does.
 */
const formSchema = signUpSchema.omit({ capacities: true });

type FormValues = {
  displayName: string;
  email: string;
  password: string;
};

export function SignUpScreen() {
  const { t } = useTranslation();
  const { signedIn } = useSession();
  const signUp = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Validated once on submit, then live per field. Marking an email invalid
    // while it is still being typed calls it wrong before it is finished.
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { displayName: "", email: "", password: "" },
  });

  function onSubmit(values: FormValues) {
    signUp.mutate(
      { ...values, capacities: ["customer"] },
      { onSuccess: (session) => signedIn(session.actor) },
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("signUp.title")}</Text>
      <Text style={styles.description}>{t("signUp.description")}</Text>

      <Field
        control={control}
        name="displayName"
        label={t("signUp.displayName")}
        invalid={Boolean(errors.displayName)}
        autoCapitalize="words"
      />
      <Field
        control={control}
        name="email"
        label={t("signUp.email")}
        invalid={Boolean(errors.email)}
        keyboardType="email-address"
      />
      <Field
        control={control}
        name="password"
        label={t("signUp.password")}
        hint={t("signUp.passwordHint")}
        invalid={Boolean(errors.password)}
        secureTextEntry
      />

      {signUp.error ? (
        <Text style={styles.errorText}>{describe(signUp.error, t)}</Text>
      ) : null}

      <Pressable
        style={[styles.primaryButton, signUp.isPending && styles.disabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={signUp.isPending}
        accessibilityRole="button"
      >
        {signUp.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>{t("signUp.submit")}</Text>
        )}
      </Pressable>

      <Link href="/sign-in" style={styles.link}>
        <Text style={styles.linkText}>{t("signUp.haveAccount")}</Text>
      </Link>
    </View>
  );
}

function Field({
  control,
  name,
  label,
  hint,
  invalid,
  ...input
}: {
  control: ReturnType<typeof useForm<FormValues>>["control"];
  name: keyof FormValues;
  label: string;
  hint?: string;
  invalid?: boolean;
} & ComponentProps<typeof TextInput>) {
  const { t } = useTranslation();

  /**
   * The rule lives in the contract; only the wording lives here.
   *
   * Zod's own message would leak "String must contain at least 8 character(s)"
   * into the UI — English, developer-facing, and untranslatable. Keying the text
   * by field keeps the server's schema as the single source of what is valid.
   */
  const error = invalid ? t(`signUp.errors.${name}`) : undefined;

  return (
    <View style={styles.field}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={[styles.input, error ? styles.inputInvalid : null]}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel={label}
            // Announced together, so a screen reader hearing the field also
            // hears why it was rejected instead of finding out on submit.
            accessibilityHint={error ?? hint}
            {...input}
          />
        )}
      />
      {error ? (
        <Text style={styles.fieldError}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    if (error.kind === "network") return t("error.network");
    // 409 EMAIL_TAKEN is the one failure the user can act on, and the action is
    // signing in rather than trying another password.
    if (error.kind === "conflict") return t("signUp.emailTaken");
    if (error.kind === "validation") return t("error.validation");
  }
  return t("error.unknown");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
  },
  inputInvalid: {
    borderColor: "#dc2626",
  },
  fieldError: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 6,
  },
  hint: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 6,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 16,
  },
  primaryButton: {
    minHeight: 48,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
  link: {
    marginTop: 20,
    alignSelf: "center",
  },
  linkText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "600",
  },
});
