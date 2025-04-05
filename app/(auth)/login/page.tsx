import { LoginForm } from "@/modules/authentication/components/login-form";
import { getCurrentUser } from "@/modules/authentication/utilities/auth";
import { redirect } from "next/navigation";
import { oauthProviderFactory } from "@/modules/authentication/utilities/oauth/provider-factory";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  // Get OAuth providers
  const mainProviders = oauthProviderFactory
    .getMainProviders()
    .map((p) => p.getProvider());
  const additionalProviders = oauthProviderFactory
    .getAdditionalProviders()
    .map((p) => p.getProvider());

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm
        oauthProviders={{
          main: mainProviders,
          additional: additionalProviders,
        }}
      />
    </div>
  );
}
