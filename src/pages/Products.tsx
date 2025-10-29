import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RootState } from "../app/store/store";
import { fetchProducts } from "@/features/products/productsSlice";
import type { AppDispatch } from "../app/store/store";
// --- Stałe i typy ---
const CATEGORIES = ["Audio", "Phone", "Laptop", "Accessory"] as const;
type Category = (typeof CATEGORIES)[number];
type CategoryFilter = Partial<Record<Category, boolean>>;
type SortKey = "relevance" | "price_asc" | "price_desc" | "rating_desc";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const ALL_PRODUCTS = useSelector(
    (state: RootState) => state.products.products
  );
  const status = useSelector((state: RootState) => state.products.status);

  //Wywolanie pobrania produktow

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // --- Stany UI ---
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 11000]);
  const [categories, setCategories] = useState<CategoryFilter>({});
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 8;

  // --- Filtrowanie + sortowanie ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        (Object.values(categories).some(Boolean)
          ? categories[p.category]
          : true)
    ).sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating_desc":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [query, sort, priceRange, categories, ALL_PRODUCTS]);

  // --- Paginacja ---
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // --- Handlery ---
  const onFiltersChange = () => setPage(1);

  const toggleCategory = (key: Category) => {
    setCategories((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      onFiltersChange();
      return next;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setSort("relevance");
    setPriceRange([0, 11000]);
    setCategories({});
    setPage(1);
  };

  // --- Render ---
  return (
    <div className="mx-auto max-w-7xl p-6 dark:bg-stone-950 dark:text-white">
      <h1 className="mb-6 text-3xl font-bold">🛍️ Produkty</h1>

      {/* 🔎 Pasek narzędzi: wyszukiwarka + sortowanie */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label htmlFor="search" className="p-2">
            Wyszukaj
          </Label>
          <Input
            id="search"
            placeholder="Szukaj produktu…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onFiltersChange();
            }}
          />
        </div>

        <div>
          <Label className="p-2">Sortuj</Label>
          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v as SortKey);
              onFiltersChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sortowanie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Domyślnie</SelectItem>
              <SelectItem value="price_asc">Cena: rosnąco</SelectItem>
              <SelectItem value="price_desc">Cena: malejąco</SelectItem>
              <SelectItem value="rating_desc">Ocena: malejąco</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🧱 Layout: sidebar + produkty */}
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filtrów */}
        <aside className="space-y-6 rounded-2xl border p-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Kategoria</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <Checkbox
                    checked={!!categories[cat]}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium">Cena (PLN)</h3>
            <Slider
              value={priceRange}
              onValueChange={(v) => {
                setPriceRange(v as [number, number]);
                onFiltersChange();
              }}
              min={0}
              max={11000}
              step={50}
            />
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <Badge variant="secondary">{priceRange[0]} zł</Badge>
              <Badge variant="secondary">{priceRange[1]} zł</Badge>
            </div>
          </div>

          <Button variant="outline" onClick={resetFilters} className="w-full">
            Wyczyść filtry
          </Button>
        </aside>

        {/* 🛒 Siatka produktów */}
        <section>
          {status === "loading" ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              Ładowanie produktów...
            </p>
          ) : status === "failed" ? (
            <p className="text-center text-sm text-red-500 py-10">
              Błąd ładowania produktów ❌
            </p>
          ) : currentPageItems.length === 0 ? (
            <p className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
              Brak wyników dla podanych filtrów.
            </p>
          ) : (
            <div
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {currentPageItems.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                />
              ))}
            </div>
          )}

          {/* 🔄 Paginacja */}
          {filtered.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Poprzednia
              </Button>
              <span className="px-3 text-sm text-muted-foreground">
                Strona {page} / {pageCount}
              </span>
              <Button
                variant="outline"
                disabled={page === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Następna
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
