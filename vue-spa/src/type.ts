export interface Product{
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    thumbnail: string;
    images: string[];
    discountPercentage: number;
    stock: number;
    brand: string;
    category: string;

}

export interface ProductResponse{
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Category {
  slug: string
  name: string
  url: string
}