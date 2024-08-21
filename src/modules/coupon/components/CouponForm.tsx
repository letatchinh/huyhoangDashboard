import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Switch,
  Tabs,
  TreeSelect
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import Loading from "~/components/common/Loading/index";
import { requireRules, requireRulesCustom } from "~/constants/defaultValue";
import GeoTreeSelect from "~/modules/geo/components/GeoTreeSelect";
import { RELATIVE_POSITION } from "~/modules/geo/constants";
import { useFailedAnt } from "~/utils/hook";
import {
  defaultConditions,
  DEFAULT_COUPON,
  STATE,
  STATE_VI
} from "../constants";
import { useCouponGetByIdCompleted, useCreateCoupon, useGetCoupon, useUpdateCoupon } from "../coupon.hook";
import CustomerApplyFormItem from "./CustomerApplyFormItem";
import TargetFormItem from "./TargetFormItem";
import { detailCustomerApplyFor } from "../coupon.modal";
const CLONE_defaultConditions: any = defaultConditions;
type propsType = {
  onCancel: (p?: any) => void;
  id?: any;
};
export default function CouponForm({
  onCancel,
  id,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { onFinishFailed, ErrorComponent } = useFailedAnt();
  const targetIds = Form.useWatch('targetIds',form);
  const customerApplyIds : detailCustomerApplyFor[] = Form.useWatch('customerApplyIds',form);
  const allowAllApply : detailCustomerApplyFor[] = Form.useWatch('allowAllApply',form);
  const [coupon, loading] = useGetCoupon(id);
  const isGetByIdCompleted = useCouponGetByIdCompleted();
  
  const [isSubmitLoading, create] = useCreateCoupon(onCancel);
  const [, update] = useUpdateCoupon(onCancel);
  const onFinish = (values: any) => {
    const {isFreeShip} = values;
    const submitData = {
      ...values,
      ...isFreeShip && {discount : null},
    };
    
    if (id) {
      update({
        _id: id,
        ...submitData,
      });
    } else {
      create(submitData);
    }
  };
  const onValuesChange = (change: any) => {
    const keyChange = Object.keys(change)[0];
    const valueChange = change[keyChange];
    if (keyChange === "target") {
      if (valueChange === "BILL") {

        form.setFieldsValue({
          targetIds: null,
        });
      }
    };
    if(keyChange === 'discount'){
      if(get(valueChange,'type') === 'VALUE'){
        form.setFieldsValue({
          discount: {
            ...valueChange,
            maxDiscount : null
          },
        });
      }
    };
    if(keyChange === 'target'){
      if(valueChange === 'BILL_ITEM'){
        form.setFieldsValue({
          applyFor: "BILL"
        })
      }
    };
    if(keyChange === 'applyFor'){
      if(valueChange === 'BILL'){
        form.setFieldsValue({
          isFreeShip: false
        })
      }
    };
    if(keyChange === 'isFreeShip'){
      if(valueChange){
        form.setFieldsValue({
          discount: null
        })
      }
    };

    if(keyChange === 'allowAllApply'){
      if(!!valueChange?.all){
        form.setFieldsValue({
          customerApplyIds : [],
          allowAllApply : {
            b2b : true,
            b2c : true,
            all : true,
          }
        });
        
      }else{
        // Handle Remove All refCollection === "pharma_profile" From customerApplyIds
        const removeB2b = customerApplyIds?.filter((item ) => valueChange?.b2b ? item?.refCollection !== "pharma_profile" : true);
        // Handle Remove All refCollection === "pharma_profile" From removeB2b
        const removeB2c = removeB2b?.filter((item ) => valueChange?.b2c ? item?.refCollection !== "partner" : true);
        form.setFieldsValue({
          customerApplyIds : removeB2c
        })
      }
    }
      
    if(keyChange === 'managementArea'){
      if(valueChange){
        form.setFieldsValue({
          managementArea : valueChange?.map((item:any) => item?.value ? item.value : item) // Verify that the Object Or String
        })
      }
    };
  };

  useEffect(() => {
    if (id && coupon) {
      form.setFieldsValue({
        ...coupon,
        startDate: coupon?.startDate && dayjs(coupon.startDate),
        endDate: coupon?.endDate && dayjs(coupon.endDate),
      });
    }
  }, [coupon, id]);

  const typeDiscount = Form.useWatch(["discount", "type"], form);
  return (
    <Form
      scrollToFirstError
      onValuesChange={onValuesChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ flex: 1 }}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
      initialValues={DEFAULT_COUPON}
      onFinishFailed={onFinishFailed}
    >
      {loading && <Loading loading/>}
      <ErrorComponent />
      <Tabs type="card">
        <Tabs.TabPane key={"1"} tab="Thông tin">
          <BaseBorderBox title={'Thông tin mã'}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={requireRulesCustom("Vui lòng nhập tên mã")}
                name={"name"}
                label="Tên mã"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={requireRulesCustom("Vui lòng nhập mã")}
                name={"giftCode"}
                label="Mã"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        <Form.Item shouldUpdate noStyle>
          {({getFieldValue}) => !getFieldValue('isFreeShip') && <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                className="noWrap"
                name={["discount", "value"]}
                label="Giá trị giảm"
                rules={[
                  ({}) => ({
                    validator(_, value) {
                      if(!value) {
                        return Promise.reject(
                          new Error("Vui lòng nhập giá trị giảm")
                        ); 
                      }
                      if (typeDiscount === "PERCENT" && value > 100) {
                        return Promise.reject(
                          new Error("Phần trăm phải bé hơn 100%!")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumberAnt
                  style={{ width: "100%" }}
                  min={0}
                  {...(typeDiscount === "PERCENT" && { max: 100 })}
                  addonAfter={
                    <Form.Item
                      style={{ marginBottom: "unset" }}
                      name={["discount", "type"]}
                    >
                      <Radio.Group size="small">
                        <Radio.Button value={"PERCENT"}>%</Radio.Button>
                        <Radio.Button value={"VALUE"}>Giá trị</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                hidden={typeDiscount === 'VALUE'}
                name={["discount", "maxDiscount"]}
                label="Giảm tối đa"
              >
                <InputNumberAnt />
              </Form.Item>
            </Col>
          </Row>}
        </Form.Item>
          
        <Form.Item shouldUpdate noStyle>
          {({getFieldValue}) => getFieldValue('applyFor') === "SHIP" &&  <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                valuePropName="checked"
                name={"isFreeShip"}
                label="Miễn phí ship"
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>}
        </Form.Item>
          
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name={"limit"} label="Số lượng">
                <InputNumberAnt
                  style={{ width: "100%" }}
                  addonAfter={<div>Lần</div>}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item shouldUpdate noStyle>
                {({getFieldValue}) => <Form.Item
                rules={requireRules}
                name={"applyFor"}
                label="Mã dùng để"
                tooltip={getFieldValue("target") === "BILL_ITEM" && "Nếu muốn đổi sang Free Ship vui lòng đổi đối tượng áp dụng mã sang Đơn hàng ở Tab đối tượng áp dụng mã"}
              >
                <Radio.Group disabled={getFieldValue("target") === "BILL_ITEM"}>
                  <Radio.Button value={"BILL"}>Đơn hàng</Radio.Button>
                  <Radio.Button value={"SHIP"}>Free ship</Radio.Button>
                </Radio.Group>
              </Form.Item>}
              </Form.Item>
            </Col>
          </Row>

        

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                valuePropName="checked"
                name={"multiple"}
                label="Dùng kết hợp"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item rules={requireRules} name={"state"} label="Trạng thái">
                <Radio.Group>
                  <Radio.Button value={STATE.PUBLIC}>
                    {STATE_VI.PUBLIC}
                  </Radio.Button>
                  <Radio.Button value={STATE.PRIVATE}>
                    {STATE_VI.PRIVATE}
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item labelCol={{ span: 4 }} name={"description"} label="Mô tả">
            <TextArea />
          </Form.Item>

          <Form.Item labelCol={{ span: 4 }} name={"managementArea"} label="Vùng áp dụng">
                <GeoTreeSelect
                  autoClearSearchValue
                  labelInValue={true}
                  listItemHeight={200}
                  multiple={true}
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  showEnabledValuesOnly={true}
                  showSearch={true}
                  size="large"
                  treeCheckStrictly={true}
                  treeCheckable={true}
                  treeDefaultExpandedKeys={['1', '2', '3']}
                  checkablePositions={[RELATIVE_POSITION.IS_CHILD, RELATIVE_POSITION.IS_EQUAL]}
                />
          </Form.Item>
          </BaseBorderBox>

          <BaseBorderBox title={'Hạn dùng mã'}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name={"startDate"} label="Từ">
                <DatePicker showTime allowClear style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"endDate"} label="Đến">
                <DatePicker showTime allowClear style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          </BaseBorderBox>

          <BaseBorderBox title={'Điều kiện'}>
          <Form.Item label="Không áp dụng điều kiện" name={'disabledCondition'} valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
          {({getFieldValue}) =>   {
            const isDisabled = !!getFieldValue('disabledCondition');
            return <Form.List name={"conditions"}>
            {(fields, {}) => (
              <>
                {fields.map((field, index) => {
                  const key = form.getFieldValue([
                    "conditions",
                    index,
                    "key",
                  ]);

                  return (
                    <Row gutter={16}>
                      <Col span={8}>
                        <span>{CLONE_defaultConditions[key].vi}</span>
                      </Col>

                      <Col flex={1}>
                        {key === defaultConditions.BILL_FIRST.key && null}
                        {key === defaultConditions.BILL_PRICE.key && (
                          <Form.Item
                            name={[
                              index,
                              "value",
                              defaultConditions.BILL_PRICE.key,
                              "value",
                            ]}
                          >
                            <InputNumberAnt disabled={isDisabled} style={{ width: "100%" }} />
                          </Form.Item>
                        )}
                        {key === defaultConditions.PRODUCT_COUNT.key && (
                          <Form.Item
                            name={[
                              index,
                              "value",
                              defaultConditions.PRODUCT_COUNT.key,
                              "value",
                            ]}
                          >
                            <InputNumberAnt disabled={isDisabled} style={{ width: "100%" }} />
                          </Form.Item>
                        )}
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          valuePropName="checked"
                          name={[index, "isActive"]}
                        >
                          <Switch disabled={isDisabled}/>
                        </Form.Item>
                      </Col>
                      <Form.Item hidden name={[index, "key"]} />
                    </Row>
                  );
                })}
              </>
            )}
          </Form.List>
          }}
          </Form.Item>
          </BaseBorderBox>
        </Tabs.TabPane>
        <Tabs.TabPane forceRender key={"2"} tab="Đối tượng áp dụng mã">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={requireRules}
                name={"target"}
                label="Mã dành cho"
              >
                <Radio.Group>
                  <Radio value={"BILL"}>Đơn hàng</Radio>
                  <Radio value={"BILL_ITEM"}>Mặt hàng</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <TargetFormItem targetIds={targetIds}/>
        </Tabs.TabPane>
        <Tabs.TabPane forceRender key={"3"} tab="Những ai được dùng mã">
          {(isGetByIdCompleted || !id) && <CustomerApplyFormItem customerApplyIds={customerApplyIds} allowAllApply={allowAllApply}/>}
        </Tabs.TabPane>
      </Tabs>

      <Flex justify={"center"}>
        <Button loading={isSubmitLoading} type="primary" htmlType="submit">
          {id ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Flex>
    </Form>
  );
}
