import { DeleteOutlined, InfoCircleTwoTone, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox,Select, Col, Form, Row, Space, Switch, message } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import WithPermission from '~/components/common/WithPermission';
import useTranslate from '~/lib/translation';
import POLICIES from "~/modules/policy/policy.auth";
import { useDeleteProductUnit, useGetlistProductUnit, useProductUnitPaging, useUpdateProductUnit, useProductUnitQueryParams, useUpdateProductUnitParams } from '../productUnit.hook';
import ProductUnitForm from './ProductUnitForm';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import { SelectProps } from 'antd/lib';
import ExportExcelButton from '~/modules/export/component';
import useCheckboxExport from '~/modules/export/export.hook';
type propsType = {

}
export default function ProductUnit(props: propsType): React.JSX.Element {
  const [query] = useProductUnitQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductUnitParams(query)
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(null);
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    form.resetFields();
    setId(null);
  }, []);
  const [listProductUnit, isLoading] = useGetlistProductUnit(query);
  const [, deleteProductConfig] = useDeleteProductUnit();
  const { t }: any = useTranslate();
  const paging = useProductUnitPaging();
  const [, updateProductUnit] = useUpdateProductUnit(handleCloseForm);
  const [form] = Form.useForm();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_UNIT);
  const [search, setSearch] = useState(null);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_UNIT);
  const [arrCheckBox, onChangeCheckBox] = useCheckboxExport();
  interface DataType {
    _id: string;
    name: string;
    note: string,
    status: string,
  };
  const handleOpenForm = useCallback((id?: any) => {
    if (id) setId(id);
    setShowForm(true);
  }, []);
  const handleDelete = (id: any) => {
    deleteProductConfig(id);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên đơn vị tính',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      key: 'note',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'status',
      align: 'center',
      width: '120px',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record?.status === 'ACTIVE'}
          onChange={(value: any) => {
            if (!canUpdate) return message.warning('Bạn không có quyền thay đổi');
            updateProductUnit({ status: value ? 'ACTIVE' : 'INACTIVE', id: record?._id });
          }}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <WithPermission permission={POLICIES.UPDATE_UNIT}>
            <Button icon={<InfoCircleTwoTone />} type="primary" onClick={() => handleOpenForm(record?._id)}>
              Xem chi tiết
            </Button>
          </WithPermission>
          <WithPermission permission={POLICIES.DELETE_UNIT}>
            <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
              Xóa
            </Button>
          </WithPermission>
        </Space>
      ),
    },
    ...(
      canDownload ? [
        {
          title: 'Lựa chọn',
          key: '_id',
          width: 80,
          align: 'center' as any,
          render: (item: any, record: any) =>
          {
            const id = record._id;
            return (
              <Checkbox
                checked= {arrCheckBox?.includes(id)}
                onChange={(e)=>onChangeCheckBox(e.target.checked, id)}
          />)}
        },
      ]: []
    ) 
  ];
  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };
  const options: SelectProps['options'] = [
    {
      label: 'Hoạt động',
      value: 'ACTIVE',
    },
    {
      label: 'Không hoạt động',
      value: 'INACTIVE',
    },
  ];
  const pageSizeOptions = ['10', '20', '50', '100'];
  return (
    <>
      <Breadcrumb title={t('Quản lý đơn vị tính')} />
      <div className='product-config' style={{ marginBottom: 16, display: 'flex', gap: '30px' }}>

        <WhiteBox style={{ width: '20%' }}>
          <label>Trạng thái:</label>
          <Select
            style={{ height: '50px', padding: '5px 0px', width: '100%' }}
            value={search}
            allowClear
            onChange={(e) => {
              setSearch(e)
              onParamChange({ ['status']: e });
            }}
            options={options}
          />
        </WhiteBox>
        <div style={{ width: '80%', height: '100%' }}>
          <div className="product-config-action" >
            <Row justify="space-between">
              <Col span={8}>
                <Search
                  style={{ height: '50px', padding: '5px 0px' }}
                  placeholder="Nhập bất kì để tìm..."
                  value={keyword}
                  onChange={(e) => (setKeyword(e.target.value))
                  }
                  onSearch={onSearch}
                  allowClear
                  enterButton={<SearchOutlined />}
                />
              </Col>
              <Col>
                <Row>
                  <Col>
                    <WithPermission permission={POLICIES.WRITE_UNIT}>
                      <Button icon={<PlusCircleOutlined />} onClick={() => handleOpenForm()} type="primary">
                        Thêm mới
                      </Button>
                    </WithPermission>
                  </Col>
                  <Col>
                    <WithPermission permission={POLICIES.DOWNLOAD_SUPPLIER}>
                        <ExportExcelButton
                          api='unit'
                          exportOption = 'unit'
                          query={query}
                          fileName='Quản lý đơn vị tính'
                          ids={arrCheckBox}
                        />
                    </WithPermission>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <WhiteBox>
            <TableAnt
              dataSource={listProductUnit}
              loading={isLoading}
              columns={columns}
              size="small"
              pagination={{
                ...paging,
                pageSizeOptions: pageSizeOptions,
                showSizeChanger: true, // Hiển thị dropdown chọn kích thước trang
                defaultPageSize: 10,
                showTotal: (total) => `Tổng cộng: ${total} `,
                onChange(page, pageSize) {
                  onParamChange({ page, limit: pageSize });
                },
              }}
            />
          </WhiteBox>
        </div>

        <ModalAnt
          open={showForm}
          title={id ? 'Cập nhật đơn vị tính' : 'Tạo đơn vị tính'}
          onCancel={handleCloseForm}
          footer={null}
          // destroyOnClose
          width={800}
        >
          <ProductUnitForm id={id} setId={setId} updateProductUnit={updateProductUnit} callBack={handleCloseForm} />
        </ModalAnt>
      </div>
    </>

  );
}