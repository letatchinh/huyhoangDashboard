import { Col, Row, Typography } from "antd";
import React from "react";
import useCreateBillStore from "~/store/createBillContext";
import { formatter } from "~/utils/helpers";
type propsType = {};
const Layout = ({
  label,
  children,
  isLarge,
}: {
  label: any;
  children: any;
  isLarge?: boolean;
}) => (
  <Row justify={"space-between"} align="middle">
    <Col>
      <Typography.Text
        style={{ fontSize: isLarge ? 18 : 16, fontWeight: isLarge ? 600 : 400 }}
      >
        {label}
      </Typography.Text>
    </Col>
    <Col>{children}</Col>
  </Row>
);
export default function TotalBill(props: propsType): React.JSX.Element {
  const {
    totalPrice,
    totalQuantity,
    totalPriceAfterDiscount,
    totalDiscount,
    totalDiscountFromProduct,
    totalDiscountFromSupplier,
  } = useCreateBillStore();
  return (
    <div>
      <Layout label={"Số lượng sản phẩm"}>{formatter(totalQuantity)}</Layout>
      <Layout label={"Tổng tiền"}>{formatter(totalPrice)}</Layout>
      {totalDiscountFromProduct?.["DISCOUNT.CORE"] ?  <Layout label={"Tổng chiết khấu cứng từ sản phẩm"}>-{formatter(totalDiscountFromProduct?.["DISCOUNT.CORE"])}</Layout> : null}
      {totalDiscountFromProduct?.["DISCOUNT.SOFT"] ? <Layout label={"Tổng chiết khấu mềm từ sản phẩm"}>-{formatter(totalDiscountFromProduct?.["DISCOUNT.SOFT"])}</Layout> : null}
      {totalDiscountFromProduct?.["LK"] ? <Layout label={"Tổng chiết khấu luỹ kế từ sản phẩm"}>-{formatter(totalDiscountFromProduct?.["LK"])}</Layout> : null}
      {totalDiscountFromSupplier?.["DISCOUNT.CORE"] ? <Layout label={"Tổng chiết khấu cứng từ nhà cung cấp"}>-{formatter(totalDiscountFromSupplier?.["DISCOUNT.CORE"])}</Layout> : null}
      {totalDiscountFromSupplier?.["DISCOUNT.SOFT"] ?<Layout label={"Tổng chiết khấu mềm từ nhà cung cấp"}>-{formatter(totalDiscountFromSupplier?.["DISCOUNT.SOFT"])}</Layout> : null}
      {totalDiscountFromSupplier?.["LK"] ?<Layout label={"Tổng chiết khấu luỹ kế từ nhà cung cấp"}>-{formatter(totalDiscountFromSupplier?.["LK"])}</Layout> : null}
      <Layout label={"Tổng chiết khấu"}>{formatter(totalDiscount)}</Layout>
      <Layout isLarge={true} label={"Tổng tiền phải trả"}>
        <Typography.Text style={{ fontSize: 18, fontWeight: 600 }}>
          {formatter(totalPriceAfterDiscount)}
        </Typography.Text>
      </Layout>
    </div>
  );
}
