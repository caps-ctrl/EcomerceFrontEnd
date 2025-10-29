import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "@/features/Cart/cartSlice";
import type { AppDispatch, RootState } from "@/app/store/store";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const MotionButton = motion.create(Button);

  // token z authSlice
  const token = useSelector((state: RootState) => state.auth.token);

  const handleAddToCart = () => {
    if (!token) {
      alert("Musisz być zalogowany, aby dodać produkt do koszyka!");
      return;
    }

    dispatch(addToCartBackend({ productId: id, quantity: 1 }));
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-blue-800   transition-shadow">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <CardContent className="p-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600 mb-4">{price} zł</p>
        <MotionButton
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0 }}
          className="cursor-pointer dark:bg-blue-500   text-white dark:hover:bg-blue-600"
          onClick={handleAddToCart}
        >
          Dodaj do koszyka
        </MotionButton>
      </CardContent>
    </Card>
  );
}
