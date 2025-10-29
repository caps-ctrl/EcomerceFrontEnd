import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Theme from "../components/themeSwitcher";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useSelector((state: RootState) =>
    state.cart.cart.reduce((total, item) => total + item.quantity, 0)
  );

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: 275, transition: { duration: 0.2 } },
  };

  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: (i: number) => {
      if (i === 1) return { rotate: 45, y: 8 };
      if (i === 2) return { opacity: 0 };
      if (i === 3) return { rotate: -45, y: -8 };
      return {};
    },
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-stone-950 dark:text-white caret-transparent relative border-b-2  border-blue-900 z-50">
      {/* Logo */}
      <NavLink to={"/"}>
        <h1 className="text-xl font-bold">Mini Shop</h1>
      </NavLink>

      {/* Hamburger button - mobile */}
      <button
        className="md:hidden flex flex-col justify-center gap-1 w-6 h-6 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            animate={isOpen ? "open" : "closed"}
            variants={lineVariants}
            className="block h-0.5 w-full bg-black dark:bg-white origin-center"
          />
        ))}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-4 items-center">
        <NavLink to={"products"}>
          <Button variant="navbutton">Produkty</Button>
        </NavLink>
        <NavLink to={"contact"}>
          <Button variant="navbutton">Kontakt</Button>
        </NavLink>
        {isAuthenticated ? (
          <NavLink to={"myprofile"}>
            {" "}
            <Button variant="navbutton" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              My profile
            </Button>
          </NavLink>
        ) : (
          <NavLink to={"login"}>
            {" "}
            <Button variant="navbutton" className="flex items-center gap-1">
              <User className="h-4 w-4" /> Login
            </Button>
          </NavLink>
        )}

        <NavLink to={"cart"}>
          <Button variant="outline" className="dark:text-white relative">
            <ShoppingCart className="mr-2 h-4 w-4" /> Koszyk
            <span
              className={
                cartCount
                  ? "-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold duration-300 ease-in-out"
                  : "-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold opacity-0 hidden"
              }
            >
              {cartCount > 0 ? cartCount : ""}
            </span>
          </Button>
        </NavLink>
        <Theme />
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-16 left-0 w-full bg-white dark:bg-stone-900 shadow-md flex flex-col gap-4 dark:text-white p-4 md:hidden"
          >
            <NavLink to={"products"} onClick={() => setIsOpen(false)}>
              <Button variant="navbutton" className="w-full">
                Produkty
              </Button>
            </NavLink>
            <NavLink to={"contact"} onClick={() => setIsOpen(false)}>
              <Button variant="navbutton" className="w-full">
                Kontakt
              </Button>
            </NavLink>
            <NavLink to={"myprofile"} onClick={() => setIsOpen(false)}>
              <Button
                variant="navbutton"
                className="w-full flex items-center gap-1"
              >
                <User className="h-4 w-4" /> MyProfile
              </Button>
            </NavLink>
            <NavLink to={"cart"} onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                className="w-full relative dark:text-white"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Koszyk
                <span
                  className={
                    cartCount
                      ? "-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
                      : "-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold opacity-0 hidden"
                  }
                >
                  {cartCount > 0 ? cartCount : ""}
                </span>
              </Button>
            </NavLink>
            <div className="max-w-50">
              <Theme />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
