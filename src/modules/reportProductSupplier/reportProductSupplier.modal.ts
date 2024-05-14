export type TypeProps = {};

export const TYPE_REPORT = {
  groupProduct: 'groupProduct',
  groupSupplier: 'groupSupplier',
  groupCustomer: 'groupCustomer',
  groupArea: 'groupArea',
  groupByRangerDateWithProduct: 'groupByRangerDateWithProduct',
  groupByRangerDateWithSupplier: 'groupByRangerDateWithSupplier',
  groupByRangerDateWithCustomer: 'groupByRangerDateWithCustomer',
} as const;

export const TYPE_REPORT_VI: any = {
  groupProduct: 'Sản phẩm',
  groupSupplier: 'Nhà cung cấp',
  groupCustomer: 'Khách hàng',
  groupArea: 'Khu vực',
  groupByRangerDateWithProduct: 'Sản phẩm theo thời gian',
  groupByRangerDateWithSupplier: 'Nhà cung cấp theo thời gian',
  groupByRangerDateWithCustomer: 'Khách hàng theo thời gian',
};

export const FILTER_BY: any = {
  WEEKLY: "WEEKLY",
  MONTHLY: " MONTHLY",
  QUARTERLY: " QUARTERLY",
  YEARLY: "  YEARLY",
};
export const FILTER_BY_VI: any = {
  WEEKLY: "Tuần",
  MONTHLY: "Tháng",
  QUARTERLY: "Quý",
  YEARLY: "Năm",
};
