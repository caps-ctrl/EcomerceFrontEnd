import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/app/store/store";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { createSelector } from "@reduxjs/toolkit";
import { LogoLoop } from "../components/LogoLoop";
import { fetchProducts } from "@/features/products/productsSlice";
import SplitText from "../components/SplitText";
export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const selectImportantProducts = createSelector(
    (state: RootState) => state.products.products,
    (products) => products.filter((p) => p.rating > 4.3)
  );
  const status = useSelector((state: RootState) => state.products.status);
  const importantProducts = useSelector(selectImportantProducts);
  const logo = importantProducts.map((p) => ({
    src: p.image,
    alt: p.name,
    title: p.name,
  }));

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="min-h-screen flex flex-col caret-transparent ">
      {/* Hero Section */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: "url('/heroPhoto.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Nakładka przyciemniająca */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative container mx-auto px-6 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Witamy w <span className="text-blue-400">Mini Shop</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl mb-6"
          >
            Najlepsze produkty w świetnych cenach 🚀
          </motion.p>
          <NavLink to={"/products"}>
            <Button
              size="lg"
              className="bg-blue-900 text-white hover:bg-blue-500"
            >
              Zobacz ofertę
            </Button>
          </NavLink>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-6 ">
        {/*Important Products*/}
        <section>
          <div className="text-3xl py-15 dark:text-white font-bold text-center">
            <SplitText
              text="Popular Products"
              className="text-4xl font-semibold text-center"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </div>

          {status === "loading" ? (
            <p>Loading Products...</p>
          ) : status === "failed" ? (
            <p>Loading Failed</p>
          ) : (
            <div
              style={{
                height: "350px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <LogoLoop
                logos={logo}
                speed={60}
                direction="left"
                logoHeight={200}
                gap={50}
                pauseOnHover
                scaleOnHover
                fadeOut
                fadeOutColor="#ffffff"
                ariaLabel="Technology partners"
              />
            </div>
          )}
        </section>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-16 text-center  dark:text-white dark:bg-stone-900">
        <h2 className="text-3xl font-bold mb-4">
          Dołącz do naszej społeczności
        </h2>
        <p className="mb-6 text-gray-600">
          Zyskaj dostęp do promocji i nowości jako pierwszy
        </p>
        <NavLink to={"register"}>
          <Button size="lg">Zarejestruj się</Button>
        </NavLink>
      </section>
    </div>
  );
}
