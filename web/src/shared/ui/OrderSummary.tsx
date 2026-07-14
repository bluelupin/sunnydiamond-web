import type { CartLineItem } from "@/features/cart/types/cart.types";
import { formatCartPrice } from "@/features/cart/utils/formatCartLine";

interface OrderSummaryProps {
  items: CartLineItem[];
  totalPrice: number;
  subtotal?: number;
  taxes?: number;
  showItemDetails?: boolean;
  children?: React.ReactNode;
}

const OrderSummary = ({
  items,
  totalPrice,
  subtotal,
  taxes,
  showItemDetails = false,
  children,
}: OrderSummaryProps) => {
  const resolvedSubtotal =
    subtotal ?? items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <aside className="space-y-4 bg-secondary p-6">
      <h2 className="font-larken text-lg font-light text-foreground">Order Summary</h2>

      {showItemDetails ? (
        <div className="space-y-3">
          {items.map(({ product, quantity, id }) => (
            <div key={id} className="flex justify-between font-gill text-sm">
              <span className="text-muted-foreground">
                {product.name} × {quantity}
              </span>
              <span className="text-foreground">
                {formatCartPrice(product.price * quantity)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-2 font-gill text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatCartPrice(resolvedSubtotal)}</span>
        </div>
        {taxes !== undefined ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes</span>
            <span className="text-foreground">{formatCartPrice(taxes)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">Free</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-border pt-3 font-gill">
        <span className="font-semibold text-foreground">Total</span>
        <span className="font-semibold text-foreground">{formatCartPrice(totalPrice)}</span>
      </div>

      {children}
    </aside>
  );
};

export default OrderSummary;
