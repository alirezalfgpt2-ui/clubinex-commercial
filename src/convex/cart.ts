import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const cartWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return { ...item, product };
      })
    );

    return cartWithProducts.filter((item) => item.product !== null);
  },
});

export const addItem = mutation({
  args: { productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate quantity
    if (!Number.isInteger(args.quantity) || args.quantity <= 0 || args.quantity > 999) {
      throw new Error("تعداد نامعتبر است.");
    }

    // Check product stock before adding
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("محصول یافت نشد.");
    if (!product.isActive) throw new Error("این محصول غیرفعال است.");

    // Check existing cart quantity
    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .first();

    const currentQty = existing?.quantity || 0;
    const totalQty = currentQty + args.quantity;

    if (totalQty > product.stock) {
      throw new Error(`موجودی کافی نیست. موجودی فعلی: ${product.stock} عدد`);
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: totalQty,
      });
    } else {
      await ctx.db.insert("cartItems", {
        userId,
        productId: args.productId,
        quantity: args.quantity,
        createdAt: Date.now(),
      });
    }
  },
});

export const updateQuantity = mutation({
  args: { cartItemId: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate quantity
    if (!Number.isInteger(args.quantity) || args.quantity > 999) {
      throw new Error("تعداد نامعتبر است.");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
      return;
    }

    // Check product stock
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem) throw new Error("آیتم سبد خرید یافت نشد.");
    const product = await ctx.db.get(cartItem.productId);
    if (!product) throw new Error("محصول یافت نشد.");
    if (args.quantity > product.stock) {
      throw new Error(`موجودی کافی نیست. موجودی فعلی: ${product.stock} عدد`);
    }

    await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
  },
});

export const removeItem = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});

export const getCartTotal = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { count: 0, total: 0 };
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let total = 0;
    let count = 0;
    for (const item of items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        total += (product.salePrice ?? product.price) * item.quantity;
        count += item.quantity;
      }
    }
    return { count, total };
  },
});
