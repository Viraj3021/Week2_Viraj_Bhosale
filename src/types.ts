export type Student = {
  name: string;
  age: number;
  grade: number;
};

export type OrderBlock = {
  lineNo: number | number[];
  ProductCode: string;
};

export type Order = {
  orderID: string;
  orderInvoiceNo: string;
  OrderBlocks: OrderBlock[];
};

export type OrdersPayload = {
  items: Order[];
};

export type NumberArray = number[];