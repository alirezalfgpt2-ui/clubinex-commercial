import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, Plus, Minus, Package, ZoomIn, ZoomOut, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { formatJalaliDate } from "@/lib/jalali";

function generateSessionId() {
  if (typeof window !== "undefined") {
    let id = localStorage.getItem("sessionId");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("sessionId", id); }
    return id;
  }
  return "server";
}

export default function StoreProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = useQuery(api.products.getBySlug, slug ? { slug } : "skip");
  const addToCart = useMutation(api.cart.addItem);
  const trackView = useMutation(api.products.trackView);
  const relatedProducts = useQuery(api.products.listActive);
  const { user } = useAuth();

  // Wishlist
  const isWishlisted = useQuery(
    api.wishlists.isWishlisted,
    product ? { productId: product._id } : "skip"
  );
  const toggleWishlist = useMutation(api.wishlists.toggle);

  // Reviews from backend
  const existingReviews = useQuery(
    api.reviews.listByProduct,
    product ? { productId: product._id } : "skip"
  );
  const createReview = useMutation(api.reviews.create);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const viewTracked = useRef(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Product features from category
  const categories = useQuery(api.categories.listActive);
  const categoryFeatures: { key: string; label: string }[] = categories?.find((c: any) => c._id === product?.categoryId)?.features || [];

  // Track product view
  useEffect(() => {
    if (product && !viewTracked.current) {
      viewTracked.current = true;
      trackView({ productId: product._id, sessionId: generateSessionId() }).catch(() => {});
    }
  }, [product, trackView]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-300 text-5xl mb-4">📦</div>
          <p className="text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("برای افزودن به سبد خرید، لطفاً ابتدا وارد حساب شوید.");
      navigate(`/auth?returnTo=${encodeURIComponent(`/products/${slug}`)}`);
      return;
    }
    try {
      await addToCart({ productId: product._id, quantity });
      toast.success("محصول به سبد خرید اضافه شد.");
    } catch {
      toast.error("خطا در افزودن به سبد خرید.");
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.info("برای افزودن به علاقه‌مندی، لطفاً وارد حساب شوید.");
      return;
    }
    try {
      const added = await toggleWishlist({ productId: product._id });
      toast.success(added ? "به علاقه‌مندی اضافه شد." : "از علاقه‌مندی حذف شد.");
    } catch {
      toast.error("خطا.");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("متن نظر را وارد کنید.");
      return;
    }
    if (!user) {
      toast.info("برای ثبت نظر لطفاً وارد حساب شوید.");
      return;
    }
    try {
      await createReview({
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("نظر شما ثبت شد.");
      setReviewComment("");
      setReviewRating(5);
    } catch {
      toast.error("خطا در ثبت نظر.");
    }
  };

  const related = relatedProducts?.filter((p: any) => p._id !== product._id && p.categoryId === product.categoryId).slice(0, 4);

  // Get feature values from product.features
  const productFeatures: { key: string; label: string; value: string }[] = [];
  if (product.features && categoryFeatures.length > 0) {
    for (const feat of categoryFeatures) {
      const val = (product.features as any)[feat.key];
      if (val) productFeatures.push({ key: feat.key, label: feat.label, value: val });
    }
  }

  return (
    <>
      <SEO title={`${product.name} | فروشگاه`} description={product.shortDescription || product.description?.slice(0, 160)} keywords={(product.tags || []).join(", ")} image={product.images?.[0]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description?.slice(0, 500),
        image: product.images?.[0],
        sku: product.slug,
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        offers: {
          "@type": "Offer",
          price: product.salePrice || product.price,
          priceCurrency: "IRR",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: window.location.href,
        },
        aggregateRating: product.rating ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        } : undefined,
      }) }} />
    <div className="min-h-screen bg-gray-50">
      {/* Lightbox */}
      {lightboxOpen && product.images?.[selectedImage] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <img src={product.images[selectedImage]} alt={product.name} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
          <button className="absolute top-6 left-6 text-white text-2xl font-bold bg-white/10 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20">✕</button>
          {product.images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length); }} className="absolute right-6 text-white text-3xl bg-white/10 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/20">‹</button>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage + 1) % product.images.length); }} className="absolute left-6 text-white text-3xl bg-white/10 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/20">›</button>
            </>
          )}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link to="/products" className="hover:text-primary transition-colors">فروشگاه</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-gray-700 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className={`h-full w-full object-contain p-8 transition-transform duration-300 cursor-zoom-in ${isZoomed ? "scale-[2.5] cursor-zoom-out" : "scale-100"}`}
                    onClick={() => setLightboxOpen(true)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-8xl text-gray-200">📦</div>
                )}
                {/* Navigation arrows for multiple images */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors text-gray-600">‹</button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage + 1) % product.images.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors text-gray-600">›</button>
                  </>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                    {discountPercent}٪ تخفیف
                  </div>
                )}
                {/* Image counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 p-4 border-t border-gray-100 overflow-x-auto">
                  {product.images.map((img: string, i: number) => (
                    <button key={i} onClick={() => { setSelectedImage(i); setIsZoomed(false); }} className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === i ? "border-primary shadow-md" : "border-transparent hover:border-gray-200"}`}>
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3 leading-relaxed">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                  <span className="text-sm text-gray-400 mr-1">({product.reviewCount || 0} نظر)</span>
                </div>
                <span className="text-xs text-gray-400">{(product.views || 0).toLocaleString("fa-IR")} بازدید</span>
              </div>
              {product.shortDescription && (
                <p className="text-sm text-gray-500 leading-relaxed">{product.shortDescription}</p>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <div className="flex items-end gap-4 mb-4">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-extrabold text-gray-900">{product.salePrice!.toLocaleString("fa-IR")}</span>
                    <span className="text-sm text-gray-400 line-through mb-1">{product.price.toLocaleString("fa-IR")}</span>
                    <span className="text-xs font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-lg mb-1">{discountPercent}٪-</span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-gray-900">{product.price.toLocaleString("fa-IR")}</span>
                )}
                <span className="text-sm text-gray-400 mb-1">تومان</span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <Package className="h-4 w-4 text-gray-400" />
                {product.stock > 0 ? (
                  <span className={`text-sm font-medium ${product.stock <= (product.stockAlert || 5) ? "text-amber-600" : "text-green-600"}`}>
                    {product.stock <= (product.stockAlert || 5) ? `فقط ${product.stock} عدد باقی‌مانده` : `موجود در انبار (${product.stock} عدد)`}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-500">ناموجود</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm font-bold border-x border-gray-200">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? "ناموجود" : "افزودن به سبد خرید"}
                </button>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={handleToggleWishlist} className={`flex items-center gap-1.5 text-xs transition-colors ${isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}>
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                  {isWishlisted ? "در علاقه‌مندی" : "افزودن به علاقه‌مندی"}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("لینک کپی شد."); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" /> اشتراک‌گذاری
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: "ارسال سریع", desc: "۱-۳ روز کاری" },
                  { icon: Shield, label: "ضمانت اصالت", desc: "۱۰۰٪ اورجینال" },
                  { icon: RotateCcw, label: "گارانتی بازگشت", desc: "۷ روز ضمانت" },
                ].map((b, i) => (
                  <div key={i} className="text-center">
                    <b.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                    <p className="text-[11px] font-bold text-gray-700">{b.label}</p>
                    <p className="text-[10px] text-gray-400">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Features */}
        {productFeatures.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">ویژگی‌ها</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {productFeatures.map((f) => (
                <div key={f.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">✓</div>
                  <div>
                    <p className="text-[10px] text-gray-400">{f.label}</p>
                    <p className="text-xs font-semibold text-gray-700">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">توضیحات محصول</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {product.tags.map((tag: string, i: number) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">نظرات کاربران ({existingReviews?.length || 0})</h2>

          {/* Existing Reviews */}
          {existingReviews && existingReviews.length > 0 && (
            <div className="space-y-4 mb-8">
              {existingReviews.map((review: any) => (
                <div key={review._id} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">👤</div>
                    <div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400">{formatJalaliDate(review.createdAt)}</p>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-sm text-gray-800 mb-4">ثبت نظر</h3>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm text-gray-500 ml-2">امتیاز شما:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setReviewRating(i + 1)} className="transition-transform hover:scale-125">
                  <Star className={`h-6 w-6 cursor-pointer ${i < reviewRating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 hover:text-amber-300"}`} />
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-500 mb-1 block">نظر شما</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="نظر خود را درباره این محصول بنویسید..."
                className="w-full h-28 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleSubmitReview}
              className="flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" /> ارسال نظر
            </button>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-extrabold text-gray-900 mb-5">محصولات مرتبط</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((p: any) => {
                const hd = p.salePrice && p.salePrice < p.price;
                return (
                  <Link key={p._id} to={`/products/${p.slug}`}>
                    <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover hover:scale-105 transition-transform" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-3xl text-gray-300">📦</div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-gray-700 line-clamp-2">{p.name}</p>
                        <p className="text-sm font-extrabold text-gray-900 mt-1">
                          {(hd ? p.salePrice : p.price).toLocaleString("fa-IR")} ت
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
