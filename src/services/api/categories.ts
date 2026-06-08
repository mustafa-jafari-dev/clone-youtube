import { categories } from "./mock-data"
import type { Category } from "@/types/category"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getCategories(): Promise<Category[]> {
  await delay(100)
  return categories
}
