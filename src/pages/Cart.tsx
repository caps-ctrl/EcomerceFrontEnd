import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  selectCart,
  fetchCart,
  removeFromCartBackend,
  decreaseQuantityBackend,
  increaseQuantityBackend,
  clearCartBackend,
} from "@/features/Cart/cartSlice";
import type { RootState, AppDispatch } from "@/app/store/store";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const cart = useSelector(selectCart);
  const status = useSelector((state: RootState) => state.cart.status);

  // Bezpieczne obliczenie total
  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  // Pobierz koszyk przy wejściu na stronę
  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  if (status === "loading") return <p>Ładowanie koszyka...</p>;
  if (!cart) return <p>Wystąpił błąd przy wczytywaniu koszyka.</p>;

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-4xl p-6 caret-transparent">
        <h1 className="mb-6 text-3xl font-bold">🛒 Twój koszyk</h1>
        <p className="text-muted-foreground">Koszyk jest pusty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 caret-transparent">
      <h1 className="mb-6 text-3xl font-bold">🛒 Twój koszyk</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex  items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.image || "/placeholder.png"}
                  alt={item.product?.name || "Produkt"}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium">
                    {item.product?.name || "Produkt"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.product?.price || 0} zł × {item.quantity} ={" "}
                    <span className="font-bold">
                      {(item.product?.price || 0) * item.quantity} zł
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(
                      decreaseQuantityBackend({
                        productId: item.productId,
                        quantity: 1,
                      })
                    )
                  }
                >
                  -
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(
                      increaseQuantityBackend({
                        productId: item.productId,
                        quantity: 1,
                      })
                    )
                  }
                >
                  +
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    dispatch(removeFromCartBackend(item.productId))
                  }
                >
                  Usuń
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <h2 className="text-xl font-semibold">Razem: {total} zł</h2>
          <Button
            variant="destructive"
            onClick={() => dispatch(clearCartBackend())}
          >
            Wyczyść koszyk
          </Button>
        </div>
      </div>
    </div>
  );
}
