import { RECIPES } from '@/data/recipes';
import Client from './Client';

// Static export: pre-render one page per sample recipe.
export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export default function Page() {
  return <Client />;
}
