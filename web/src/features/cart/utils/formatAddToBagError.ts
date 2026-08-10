export function formatAddToBagErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message) {
      if (message.includes("Magento cart response was empty")) {
        return "We couldn't reach the cart service. Please try again.";
      }

      return message;
    }
  }

  return "Couldn't add this item to your bag. Please try again.";
}
