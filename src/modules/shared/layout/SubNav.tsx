import { Link, useLocation } from "react-router";
import { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  Truck, Gift, MessageSquare, Bell, FileText, Tag, Scale, BookOpen,
  Shield, Palette, Calendar, ClipboardList, Star, Heart
} from "lucide-react";

/**
 * آیتم‌های نوار ابزار زیر تاپبار
 * آیکون بالا و عنوان زیرش - زیبا و ریسپانسیو
 */
const SUB_NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
  { to: "/dashboard/products", icon: Package, label: "محصولات" },
  { to: "/dashboard/orders", icon: ClipboardList, label: "سفارشات" },
  { to: "/dashboard/cart", icon: ShoppingCart, label: "سبد خرید" },
  { to: "/dashboard/users", icon: Users, label: "کاربران" },
  { to: "/dashboard/compare", icon: Scale, label: "مقایسه" },
  { to: "/dashboard/discounts", icon: Gift, label: "تخفیف‌ها" },
  { to: "/dashboard/shipping", icon: Truck, label: "ارسال" },
  { to: "/dashboard/reports", icon: BarChart3, label: "گزارشات" },
  { to: "/dashboard/chat", icon: MessageSquare, label: "چت" },
  { to: "/dashboard/tickets", icon: Star, label: "تیکت" },
  { to: "/dashboard/blog", icon: BookOpen, label: "بلاگ" },
  { to: "/dashboard/templates", icon: FileText, label: "قالب‌ها" },
  { to: "/dashboard/roles", icon: Shield, label: "نقش‌ها" },
  { to: "/dashboard/bookings", icon: Calendar, label: "نوبت‌دهی" },
  { to: "/dashboard/notifications", icon: Bell, label: "اعلانات" },
  { to: "/dashboard/settings", icon: Settings, label: "تنظیمات" },
];

export function SubNav() {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // بررسی نیاز به فلش‌های اسکرول
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowRightArrow(scrollLeft > 2);
    setShowLeftArrow(scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    scrollRef.current?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      scrollRef.current?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // اسکرول به چپ/راست
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "right" ? -200 : 200;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // پیدا کردن آیتم فعال
  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="relative border-b bg-card/50 backdrop-blur-sm" style={{ background: `var(--subnav-bg, var(--background))` }}>
      {/* فلش راست (اسکرول به راست) */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-transparent to-transparent flex items-center justify-start pl-1 hover:from-accent/50 transition-colors"
        >
          <span className="text-muted-foreground text-lg">‹</span>
        </button>
      )}

      {/* فلش چپ (اسکرول به چپ) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-transparent to-transparent flex items-center justify-end pr-1 hover:from-accent/50 transition-colors"
        >
          <span className="text-muted-foreground text-lg">›</span>
        </button>
      )}

      {/* لیست آیتم‌ها */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SUB_NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition-all duration-200 min-w-[52px]
                ${active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
