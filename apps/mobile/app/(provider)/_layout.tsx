import { Redirect, Stack } from 'expo-router';
import { SessionGuard } from '../../src/presentation/SessionGuard';
import { HOME_ROUTE } from '../../src/application/route-guard';
import { SignOutButton } from '../../src/presentation/SignOutButton';
import { useActor } from '../../src/presentation/SessionProvider';

/**
 * A session is necessary here but not sufficient: these routes are for
 * providers, and a signed-in customer has no business publishing a listing.
 * The capacity check is `withCapacity` (SCRUM-20) and belongs in this same
 * layout, wrapped inside this guard — a capacity cannot be read before the
 * actor it belongs to has been restored.
 */
export default function ProviderLayout() {
  const actor = useActor();

  if (actor && !actor.capacities.includes('provider')) {
    return <Redirect href={HOME_ROUTE} />;
  }

  return (
    <SessionGuard group="protected">
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => <SignOutButton />,
        }}
      />
    </SessionGuard>
  );
}
