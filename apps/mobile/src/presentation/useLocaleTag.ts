import { useTranslation } from "react-i18next";
import { formattingTag } from "../application/locale";
import { deviceLocale } from "../infrastructure/device-locale";

/**
 * The tag to pass to `formatMoney` and `formatDistance`.
 *
 * Screens used to reach for `i18n.language`, which is only ever a language:
 * `"en"`, never `"en-US"`. `Intl` cannot infer a country from that, so
 * `formatDistance` never found an imperial region and every phone on earth was
 * shown kilometres. This keeps the country the device actually reported.
 */
export function useLocaleTag(): string {
  const { i18n } = useTranslation();

  return formattingTag(i18n.language, deviceLocale);
}
