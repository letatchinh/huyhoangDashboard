import { DeleteOutlined, EditOutlined, InfoCircleTwoTone, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, SelectProps, Space, Switch, message } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useState } from 'react'

import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useManufacturerPaging, useManufacturerParams, useGetManufacturerList, useManufacturerQueryParams, useDeleteManufacturer, useUpdateManufacturer, useResetAction } from '../manufacturer.hook';
import TableAnt from '~/components/Antd/TableAnt';
import ModalAnt from '~/components/Antd/ModalAnt';
import ManufacturerForm from './ManufacturerForm';
import WithPermission from '~/components/common/WithPermission';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import { Link } from 'react-router-dom';
import { PATH_APP } from '~/routes/allPath';
import BtnAdd from '~/components/common/Layout/List/Header/BtnAdd';
export default function Manufacturer() {
  const [showForm, setShowForm] = useState(false);
  const [destroy, setDestroy] = useState(false);
  const [search, setSearch] = useState(null)
  const paging = useManufacturerPaging();
  const [query] = useManufacturerQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useManufacturerParams(query);
  const [listManufacturer, isLoading] = useGetManufacturerList(query);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_MANUFACTURER);
  const canDelete = useMatchPolicy(POLICIES.DELETE_MANUFACTURER);
  const [id, setId] = useState(null);
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    form.resetFields();
    setId(null);
  }, []);
  const [, deleteManufacturer] = useDeleteManufacturer();
  const [form] = Form.useForm();
  const [isSubmitUpdateLoading, updateManufacturer] = useUpdateManufacturer(handleCloseForm);
  const { t }: any = useTranslate();
  useResetAction();
  interface DataType {
    code: string;
    key: string;
    name: string;
    description: string;
    _id: string;
    status: String,
    activity: any,
  };
  const handleOpenForm = useCallback((id?: any) => {
    if (id) { 
      setId(id);
      setDestroy(true)
     }
    setShowForm(true);
  }, []);
  const handleDelete = (id: any) => {
    deleteManufacturer(id);

  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên hãng sản xuất',
      dataIndex: 'name',
      align: 'left',
      width: '300px',
      key: 'name',
      render: (text: string, record: any) => <Link className='link_' to={PATH_APP.worldPharma.manufacturer + "/" + record?._id}>{text}</Link>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      key: 'description',
      width: '300px',
    },
      ...(canUpdate ?[  {
      title: 'Thao tác',
      dataIndex: 'activity',
      align: 'center' as any,
      width: '120px',
      key: 'activity',
      render: (value: any, record: any) => (
        <Switch
          checked={record?.status === 'ACTIVE'}
          onChange={(value: any) => {
            updateManufacturer({ status: value ? 'ACTIVE' : 'INACTIVE', id: record?._id });
          }}
          loading={isSubmitUpdateLoading}
        />
      )
    }] : []),
    ...(canDelete ?[{
      title: 'Hành động',
      key: 'action',
      align: 'center' as any,
      width: '180px',
      render: (value: any, record: any) => (
        <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record?._id)}>
        Xóa
      </Button>
      ),
    }]: []),
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
      <div>
        <Breadcrumb title="Quản lý hãng sản xuất"/>
        <Row justify={'space-between'} gutter={16} style={{ marginBottom: 12 }}>
          <Col >
            <Row gutter = {16}>
              <Col span={12}>
              <Search
                placeholder="Nhập bất kì để tìm..."
                value={keyword}
                onChange={(e) => (setKeyword(e.target.value))}
                allowClear
                onSearch={onSearch}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col span={12}>
                <Select
                  placeholder="Tìm theo trạng thái"
                  style={{
                    width: "200px",
                  }}
                  value={search}
                  allowClear
                  onChange={(e) => {
                    setSearch(e)
                    onParamChange({ ['status']: e });
                  }}
                  options={options}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row justify={"end"}>
                <WithPermission permission={POLICIES.WRITE_MANUFACTURER}>
                  <BtnAdd onClick={() => handleOpenForm()}>
                    Thêm mới
                  </BtnAdd>
                </WithPermission>
            </Row>
          </Col>
        </Row>
          <TableAnt
            dataSource={listManufacturer}
            loading={isLoading}
            columns={columns}
            size="small"
            pagination={{
              ...paging,
              pageSizeOptions: pageSizeOptions,
              showSizeChanger: true,
              defaultPageSize: 10, 
              showTotal: (total) => `Tổng cộng: ${total} `,
              onChange(page, pageSize) {
                onParamChange({ page, limit: pageSize });
              },
            }}
            stickyTop
            scroll={{ x: 'max-content' }}
          />
        <ModalAnt
          open={showForm}
          title={id? 'Cập nhật hãng sản xuất':'Thêm hãng sản xuất'}
          onCancel={handleCloseForm}
          footer={null}
          destroyOnClose={destroy}
          afterClose={() => setDestroy(false)}
        >
          <ManufacturerForm setDestroy={setDestroy} id={id} setId={setId} callBack={handleCloseForm} updateManufacturer={updateManufacturer} />
        </ModalAnt>
      </div>
    </>
  );
}
