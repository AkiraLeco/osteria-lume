import "server-only";

import { sampleMenu } from "@/data/menu";
import type { Menu } from "./types";

/**
 * Ponto único de leitura do cardápio.
 * Por enquanto devolve os dados de exemplo locais; quando o Supabase for configurado,
 * esta função passa a consultar o banco e o resto do app não precisa mudar.
 */
export async function getMenu(): Promise<Menu> {
  return {
    ...sampleMenu,
    categories: sampleMenu.categories
      .filter((category) => category.isActive)
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) => !dish.isHidden),
      })),
  };
}
