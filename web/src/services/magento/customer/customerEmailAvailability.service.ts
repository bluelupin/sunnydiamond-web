/**
 * Guest-checkout helper: true when the email can be used as a guest.
 * Calls the server route so registered emails are detected on Magento 2.4.7+.
 */
export async function isCustomerEmailAvailable(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return true;
  }

  try {
    const response = await fetch("/api/customer/email-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail }),
      cache: "no-store",
    });

    if (!response.ok) {
      return true;
    }

    const data = (await response.json()) as { available?: boolean };
    return data.available !== false;
  } catch {
    return true;
  }
}
