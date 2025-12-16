export const categories = [
  { id: 'cakes', name: 'Cakes' },
  { id: 'cupcakes', name: 'Cupcakes' },
  { id: 'seasonal', name: 'Seasonal Specials' },
];

export const products = [
  {
    id: 'birthday-chocolate-cake',
    title: 'Birthday Chocolate Cake',
    description:
      'Rich dark chocolate sponge layered with silky ganache and pastel buttercream piping. Customizable topper included.',
    price: 40,
    salePrice: 35,
    categoryId: 'cakes',
    featured: true,
    seasonalTag: 'Birthday Favourite',
    image:
      'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'strawberry-drip-cake',
    title: 'Strawberry Drip Cake',
    description:
      'Vanilla sponge with fresh strawberry filling, finished with glossy pink drip and fresh berries.',
    price: 48,
    salePrice: null,
    categoryId: 'cakes',
    featured: true,
    seasonalTag: 'Spring Special',
    image:
      'https://images.pexels.com/photos/2915283/pexels-photo-2915283.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'vanilla-cupcakes-6',
    title: 'Vanilla Cupcake Box (6)',
    description:
      'Soft vanilla cupcakes topped with pastel buttercream swirls and sprinkles. Perfect for small celebrations.',
    price: 18,
    salePrice: null,
    categoryId: 'cupcakes',
    featured: false,
    seasonalTag: 'Everyday Treat',
    image:
      'https://images.pexels.com/photos/918581/pexels-photo-918581.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'assorted-cupcakes-12',
    title: 'Assorted Cupcake Box (12)',
    description:
      'A curated mix of chocolate, vanilla, and red velvet cupcakes with custom color palette.',
    price: 32,
    salePrice: 28,
    categoryId: 'cupcakes',
    featured: true,
    seasonalTag: 'Party Box',
    image:
      'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'winter-snowflake-cake',
    title: 'Winter Snowflake Cake',
    description:
      'Velvety vanilla sponge with white chocolate frosting, decorated with delicate snowflakes and silver leaf.',
    price: 55,
    salePrice: 49,
    categoryId: 'seasonal',
    featured: false,
    seasonalTag: 'Winter Limited',
    image:
      'https://images.pexels.com/photos/1026124/pexels-photo-1026124.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];


