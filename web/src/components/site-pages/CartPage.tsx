"use client";

import Link from "next/link";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/shared/PageHead";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/shared/OrderSummary";
import { PrimaryLink } from "@/components/shared/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { seoContent } from "@/data/content";

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <PageHead title={seoContent.cart.title} description={seoContent.cart.description} />
        <div className="container py-20 text-center space-y-4">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
          <h1 className="font-heading text-2xl text-foreground">Your bag is empty</h1>
          <p className="font-body text-sm text-muted-foreground">
            Discover our exquisite diamond collection
          </p>
          <PrimaryLink to="/products" className="mt-4">Shop Now</PrimaryLink>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHead title={seoContent.cart.title} description={seoContent.cart.description} />
      <section className="container py-10 md:py-16">
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-8">
          Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map(({ product, quantity }) => (
              <CartItem
                key={product.id}
                product={product}
                quantity={quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <OrderSummary items={items} totalPrice={totalPrice}>
            <Link
              href="/checkout"
              className="block text-center w-full bg-primary hover:bg-gold-dark text-primary-foreground py-3 text-sm tracking-widest uppercase font-body transition-colors"
            >
              Proceed to Checkout
            </Link>
          </OrderSummary>
        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
