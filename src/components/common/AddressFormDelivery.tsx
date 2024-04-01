import { Col, Form, FormItemProps, Input, Row, Select, Skeleton } from 'antd';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { filterAcrossAccents } from '~/utils/helpers';
import subvn from '~/core/subvn';
import { validatePhoneNumberAntd } from '~/utils/validate';

const FormItem = Form.Item;
const { Option } = Select;
interface AddressFormSectionProps {
  isLoading?: boolean;
  form: any; // Replace 'any' with the actual type of your form
  cityCode?: string | null;
  setCityCode?: any;
  districtCode?: string | null;
  setDistrictCode?: any;
  span?: number;
  allowPhoneNumber?: boolean;
  allowEmail?: boolean;
}
const FormItemProp : FormItemProps = {
  labelAlign : 'left',
}

const AddressFormDelivery = (props: AddressFormSectionProps) => {
  const {
    isLoading,
    form,
    cityCode,
    setCityCode,
    districtCode,
    setDistrictCode,
    allowPhoneNumber = true,
    allowEmail = true,
  } = props;
  const cityId = Form.useWatch(["addressDelivery","cityId"], form);
  const districtId = Form.useWatch(["addressDelivery","districtId"], form);

  const cities = subvn.getProvinces();
  const [_cityCode, _setCityCode] = useState(cityCode); 
  const newCityCode = useMemo(() => cityCode ?? cityId, [cityCode, _cityCode,cityId]);
  
  const districts = subvn.getDistrictsByProvinceCode(newCityCode as string);
  
  const wards = subvn.getWardsByDistrictCode(districtCode ?? districtId as string);
  return (
    <>
      <Row gutter={48} align="middle" justify="space-between">
        <Col span={props?.span ?? 12}>
          <FormItem
          {...FormItemProp}
            label="Thành Phố/Tỉnh"
            name={["addressDelivery", "cityId"]}
            rules={[
              {
                required: true,
                message: "Xin vui lòng chọn Thành Phố/Tỉnh!",
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Select
                  onChange={(e) => {
                    setCityCode && setCityCode(e);
                    form && form.setFieldsValue && form.setFieldsValue({
                      addressDelivery : {
                        districtId : null,
                        wardId : null
                      }
                    });
                  }}
                // disabled={isCitiesLoading}
                // loading={isCitiesLoading}
                showSearch
                filterOption={filterAcrossAccents}
              >
                {cities.map(({ code, name }: any) => (
                  <Option key={code} value={code}>
                    {name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>

        <Col span={props?.span ?? 12}>
          <FormItem
            shouldUpdate={(pre, next) =>
              get(pre, "addressDelivery.cityId") !== get(next, "addressDelivery.cityId")
            }
            noStyle
          >
            {() => (
              <FormItem
              {...FormItemProp}
                label="Quận/Huyện"
                name={["addressDelivery", "districtId"]}
                rules={[
                  {
                    required: true,
                    message: "Xin vui lòng chọn Quận/Huyện!",
                  },
                ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue(["addressDelivery", "cityId"])}
                    onChange={(value) => {
                      setDistrictCode && setDistrictCode(value);
                      form && form.setFieldsValue && form.setFieldsValue({
                        addressDelivery : {
                          wardId : null
                        }
                      });
                    }}
                    showSearch
                    filterOption={filterAcrossAccents}
                  >
                    {districts.map(({ code, name }: any) => (
                      <Option key={code} value={code}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={48} align="middle" justify="space-between">
        <Col span={props?.span ?? 12}>
          <FormItem
            shouldUpdate={(pre, next) =>
              get(pre, "addressDelivery.cityId") !== get(next, "addressDelivery.cityId") ||
              get(pre, "addressDelivery.districtId") !== get(next, "addressDelivery.districtId")
            }
            noStyle
          >
            {() => (
              <FormItem
              {...FormItemProp}
                label="Phường/Xã"
                name={["addressDelivery", "wardId"]}
                rules={[
                  {
                    required: true,
                    message: "Xin vui lòng chọn Phường/Xã!",
                  },
                ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue(["addressDelivery", "districtId"])}
                    showSearch
                    filterOption={filterAcrossAccents}
                  >
                    {wards.map(({ code, name }: any) => (
                      <Option key={code} value={code}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </FormItem>
        </Col>
        <Col span={props?.span ?? 12}>
          <FormItem
          {...FormItemProp}
            label="Đường phố"
            name={["addressDelivery", "street"]}
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập tên đường",
              },
            ]}
          >
            {isLoading ? <Skeleton.Input active /> : <Input />}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={48} align="middle" justify="space-between">
        {allowEmail && (
          <Col span={props?.span ?? 12}>
            <FormItem
            {...FormItemProp}
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Email bạn nhập không đúng định dạng!",
                },
              ]}
            >
              {isLoading ? <Skeleton.Input active /> : <Input />}
            </FormItem>
          </Col>
        )}
        {allowPhoneNumber && (
          <Col span={props?.span ?? 12}>
            <FormItem
            {...FormItemProp}
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
              ...validatePhoneNumberAntd
              ]}
            >
              {isLoading ? <Skeleton.Input active /> : <Input />}
            </FormItem>
          </Col>
        )}
      </Row>
    </>
  );
};

export default AddressFormDelivery;