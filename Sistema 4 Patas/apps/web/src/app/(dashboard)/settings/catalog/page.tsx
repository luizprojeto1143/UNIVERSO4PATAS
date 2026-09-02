import { fetchApi } from '@/lib/api';
import CatalogClient from './CatalogClient';

export default async function CatalogPage() {
  const services = await fetchApi('catalog/services', { cache: 'no-store' });
  const products = await fetchApi('catalog/products', { cache: 'no-store' });

  return <CatalogClient initialServices={services} initialProducts={products} />;
}
