import type { CartItem } from "@/features/cart/context/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  showItemDetails?: boolean;
  children?: React.ReactNode;
}

const OrderSummary = ({
  items,
  totalPrice,
  showItemDetails = false,
  children,
}: OrderSummaryProps) => {
  return (
    <aside className="bg-secondary p-6 h-fit space-y-4">
      <h2 className="font-heading text-lg font-medium text-foreground">
        Order Summary
      </h2>

      {showItemDetails && (
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex justify-between font-body text-sm"
            >
              <span className="text-muted-foreground">
                {product.name} × {quantity}
              </span>
              <span className="text-foreground">
                ₹{(product.price * quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 font-body text-sm">
        {!showItemDetails && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">Complimentary</span>
        </div>
      </div>

      <div className="border-t border-border pt-3 flex justify-between font-body">
        <span className="font-semibold text-foreground">Total</span>
        <span className="font-semibold text-foreground">
          ₹{totalPrice.toLocaleString()}
        </span>
      </div>

      {children}
    </aside>
  );
};

export default OrderSummary;
