import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";

export async function isCustomerEmailAvailable(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return true;
  }

  try {
    const data = await magentoGraphqlFetch<{
      isEmailAvailable?: { is_email_available?: boolean | null };
    }>({
      query: `query IsEmailAvailable($email: String!) {
        isEmailAvailable(email: $email) {
          is_email_available
        }
      }`,
      variables: { email: normalizedEmail },
      cache: "no-store",
    });

    return Boolean(data.isEmailAvailable?.is_email_available);
  } catch {
    return true;
  }
}
