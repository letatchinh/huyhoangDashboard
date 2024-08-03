export interface ItemProduct{
  name: string;
  manufacturer: string;
  unit: string;
  category: string;
  quantity: number;
  barcode: string;
  notePharmacy: string;
};
export interface DataCheckWarehouse {
  listProduct: ItemProduct[];
  warehouseId: number;
};

export interface  itemType {
  quantity: number;
  discountValue: number;
  discountType: number;
  isCreateOrder: boolean;
  totalPrice: number;
}
export interface dataBillSentToWarehouse {
  warehouseId: number;
  discountValue: number;
  discountPercent: number;
  items: itemType[]; 
};