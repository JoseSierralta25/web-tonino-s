export type Size = 'P' | 'R' | 'XL';
export type Category = 'Grupo 1' | 'Grupo 2' | 'Promociones' | 'Bebidas';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  prices: Partial<Record<Size, number>> | number;
  category: Category;
  isFavorite?: boolean;
}

export const menuData: MenuItem[] = [
  // Grupo 1
  {
    id: 'g1-margarita',
    name: "Tonino's Margarita",
    description: "Salsa napolitana y mozzarella",
    prices: { P: 3.5, R: 6.5, XL: 19 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-jamon-queso',
    name: "Tonino's Jamón y Queso",
    description: "Salsa napolitana, mozzarella y jamón",
    prices: { P: 4.5, R: 7.5, XL: 20 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-napolitana',
    name: "Tonino's Napolitana",
    description: "Salsa napolitana, mozzarella, anchoas y orégano",
    prices: { P: 5, R: 10, XL: 21 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-hula-hula',
    name: "Tonino's Hula Hula",
    description: "Salsa napolitana, mozzarella, jamón, tocineta y piña",
    prices: { P: 6.5, R: 9, XL: 22 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-pio-pio',
    name: "Tonino's Pio Pio",
    description: "Salsa napolitana, mozzarella, pollo y salsa BBQ",
    prices: { P: 6, R: 9, XL: 21 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-primavera',
    name: "Tonino's Primavera",
    description: "Salsa napolitana, mozzarella, jamón, tocineta y maíz",
    prices: { P: 6, R: 10, XL: 25 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-pepperoni',
    name: "Tonino's Pepperoni",
    description: "Salsa napolitana, mozzarella y pepperoni",
    prices: { P: 6, R: 10, XL: 22 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-pesto',
    name: "Tonino's Pesto",
    description: "Salsa napolitana, mozzarella, queso ricotta y pesto",
    prices: { P: 6, R: 9, XL: 21 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-vegetariana',
    name: "Tonino's Vegetariana",
    description: "Salsa napolitana, mozzarella, aceitunas negras, champiñones, cebolla, pimentón, maíz y orégano",
    prices: { P: 6, R: 11, XL: 26 },
    category: 'Grupo 1',
  },
  {
    id: 'g1-juanga',
    name: "Tonino's Juanga",
    description: "Salsa napolitana, mozzarella, carne, jalapeño, picadillo, nachos y dip mayopesto",
    prices: { P: 7, R: 12, XL: 27 },
    category: 'Grupo 1',
    isFavorite: true,
  },
  {
    id: 'g1-dorangel',
    name: "Tonino's Dorangel",
    description: "Salsa napolitana, mozzarella, carne, pollo, chorizo, papas fritas y salsa BBQ",
    prices: { P: 7.5, R: 12.5, XL: 31 },
    category: 'Grupo 1',
    isFavorite: true,
  },

  // Grupo 2
  {
    id: 'g2-capressa',
    name: "Tonino's Capressa",
    description: "Salsa napolitana, mozzarella, queso ricotta, rodajas de tomate y pesto",
    prices: { P: 6, R: 11, XL: 21 },
    category: 'Grupo 2',
  },
  {
    id: 'g2-carbonara',
    name: "Tonino's Carbonara",
    description: "Queso crema, mozzarella, tocineta, maíz y champiñones",
    prices: { P: 8, R: 13, XL: 30 },
    category: 'Grupo 2',
  },
  {
    id: 'g2-favorita',
    name: "Tonino's Especial Doritos",
    description: "Bordes de queso, salsa napolitana, mozzarella, pepperoni, doritos y queso pecorino",
    prices: { P: 8, R: 14, XL: 31 },
    category: 'Grupo 2',
    isFavorite: true,
  },
  {
    id: 'g2-4-quesos',
    name: "Tonino's 4 Quesos",
    description: "Salsa napolitana, mozzarella, queso azul, queso ricotta y queso parmesano",
    prices: { P: 7, R: 12, XL: 26 },
    category: 'Grupo 2',
  },
  {
    id: 'g2-4-estaciones',
    name: "Tonino's 4 Estaciones",
    description: "Salsa napolitana 4 sabores alternativos",
    prices: { P: 8, R: 14, XL: 32 },
    category: 'Grupo 2',
  },
  {
    id: 'g2-atun',
    name: "Tonino's Atún",
    description: "Salsa napolitana, mozzarella, atún preparado y champiñones",
    prices: { R: 12 },
    category: 'Grupo 2',
  },

  // Promociones
  {
    id: 'promo-4-estaciones-r',
    name: "Promoción 4 Estaciones Regular + Refresco",
    description: "4 Estaciones Regular + 1 Refresco de 1.5 LT",
    prices: 10,
    category: 'Promociones',
  },
  {
    id: 'promo-4-estaciones-xl',
    name: "Promoción 4 Estaciones XL + Refresco",
    description: "4 Estaciones XL + 1 Refresco de 1.5 LT",
    prices: 20,
    category: 'Promociones',
  },

  // Bebidas
  {
    id: 'beb-agua',
    name: "Agua",
    prices: 1,
    category: 'Bebidas',
  },
  {
    id: 'beb-nestea',
    name: "Nestea",
    prices: 2,
    category: 'Bebidas',
  },
  {
    id: 'beb-cerveza',
    name: "Cerveza",
    prices: 0.85,
    category: 'Bebidas',
  },
  {
    id: 'beb-balde-cerveza',
    name: "Balde de Cervezas",
    prices: 8,
    category: 'Bebidas',
  },
  {
    id: 'beb-refresco',
    name: "Refresco 1.5 LT",
    prices: 2.5,
    category: 'Bebidas',
  },
];
