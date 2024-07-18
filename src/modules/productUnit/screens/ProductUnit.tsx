import {
  DeleteOutlined,
  InfoCircleTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Select,
  Col,
  Form,
  Row,
  Space,
  Switch,
  message,
  Flex,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import React, { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import WithPermission from "~/components/common/WithPermission";
import useTranslate from "~/lib/translation";
import POLICIES from "~/modules/policy/policy.auth";
import {
  useDeleteProductUnit,
  useGetlistProductUnit,
  useProductUnitPaging,
  useUpdateProductUnit,
  useProductUnitQueryParams,
  useUpdateProductUnitParams,
} from "../productUnit.hook";
import ProductUnitForm from "./ProductUnitForm";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { SelectProps } from "antd/lib";
import ExportExcelButton from "~/modules/export/component";
import useCheckboxExport from "~/modules/export/export.hook";
import { Link } from "react-router-dom";
import ColumnAction from "~/components/common/ColumnAction";
import BtnAdd from "~/components/common/Layout/List/Header/BtnAdd";
import DropdownAction from "~/components/common/Layout/List/Header/DropdownAction";
type propsType = {};
export default function ProductUnit(props: propsType): React.JSX.Element {
  const [query] = useProductUnitQueryParams();
  const [destroy,setDestroy] = useState(false);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateProductUnitParams(query);
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
    note: string;
    status: string;
  }
  const handleOpenUpdate = (id: any) => {
    setShowForm(true);
      setId(id);
  };
  const handleOpenFormCreate = () => { 
    setId(null);
    setShowForm(true);
  };
  const handleDelete = (id: any) => {
    deleteProductConfig(id);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Tên đơn vị tính",
      dataIndex: "name",
      align: "center",
      key: "name",
      render : (value,rc) => <Link className="link_" to={`/unit/${rc?._id}`}>
      {value}
    </Link>
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      align: "center",
      key: "note",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Thao tác",
      dataIndex: "status",
      align: "center",
      // width: '120px',
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record?.status === "ACTIVE"}
          onChange={(value: any) => {
            if (!canUpdate)
              return message.warning("Bạn không có quyền thay đổi");
            updateProductUnit({
              status: value ? "ACTIVE" : "INACTIVE",
              id: record?._id,
            });
          }}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      // width: '180px',
      render: (_, record) => {
        return (
          <ColumnAction
            onOpenForm={handleOpenUpdate}
            onDelete={handleDelete}
            _id={record?._id}
            textName='đơn vị tính'
            permissionUpdate={POLICIES.UPDATE_UNIT}
            permissionDelete={POLICIES.DELETE_UNIT}
          />
        )}
    },
    ...(canDownload
      ? [
          {
            title: "Lựa chọn",
            key: "_id",
            // width: 80,
            align: "center" as any,
            render: (item: any, record: any) => {
              const id = record._id;
              return (
                <Checkbox
                  checked={arrCheckBox?.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />
              );
            },
          },
        ]
      : []),
  ];
  const onSearch = (value: string) => {
    onParamChange({ ["keyword"]: value });
  };
  const options: SelectProps["options"] = [
    {
      label: "Hoạt động",
      value: "ACTIVE",
    },
    {
      label: "Không hoạt động",
      value: "INACTIVE",
    },
  ];
  const pageSizeOptions = ["10", "20", "50", "100"];
  return (
    <>
      <Breadcrumb title={t("Quản lý đơn vị tính")} />
      <Row gutter={10} style = {{marginBottom: '10px'}}>
        <Col span={12}>
          <Row gutter={10}>
            <Col span={8}>
              <Search
                placeholder="Nhập bất kì để tìm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={onSearch}
                allowClear
                width={300}
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
                  setSearch(e);
                  onParamChange({ ["status"]: e });
                }}
                options={options}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row justify={"end"} gutter={16}>
            <WithPermission permission={POLICIES.WRITE_UNIT}>
              <Col>
                <BtnAdd onClick={handleOpenFormCreate} />
              </Col>
            </WithPermission>
            <WithPermission permission={POLICIES.DOWNLOAD_UNIT}>
              <Col>
                <DropdownAction
                  items={[
                    <ExportExcelButton
                      api="unit"
                      exportOption="unit"
                      query={query}
                      fileName="Quản lý đơn vị tính"
                      ids={arrCheckBox}
                      useLayout="v2"
                    />,
                  ]}
                />
              </Col>
            </WithPermission>
          </Row>
        </Col>
      </Row>
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
          stickyTop
        />
      </WhiteBox>
      <ModalAnt
        open={showForm}
        title={id ? "Cập nhật đơn vị tính" : "Thêm mới đơn vị tính"}
        onCancel={handleCloseForm}
        footer={null}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
        width={800}
      >
        <ProductUnitForm
          id={id}
          setId={setId}
          updateProductUnit={updateProductUnit}
          callBack={handleCloseForm}
          setDestroy={setDestroy}
        />
      </ModalAnt>
    </>
  );
}
