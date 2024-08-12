import { Tag } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import POLICIES from "~/modules/policy/policy.auth";
import { concatAddress } from "~/utils/helpers";
import { useChangeDocumentTitle } from "~/utils/hook";
import Action from "../components/Action";
import StatusTagWarehouse from "../components/StatsusTagWarehouse";
import useBranchContext from "../store/BranchContext";
import { STATUS_LINK_WAREHOUSE_EN } from "../constants";

export default function BranchScreen() {
  useChangeDocumentTitle("Danh sách chi nhánh");
  const {
    openForm,
    branches,
    paging,
    isLoading,
    onParamChange,
    canDeleteWarehouse,
    canUpdateWarehouse,
    getListWarehouse,
  } = useBranchContext();
  const { t }: any = useTranslate();
  const columns: ColumnsType = [
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 300,
      render(value, record, index) {
        return concatAddress(value);
      },
    },
    {
      title: "Trạng thái liên kết kho",
      key: "statusLinkWarehouse",
      align: "center",
      width: 180,
      render: (value, record) => {
        const id = record?._id;
        return <StatusTagWarehouse status={getListWarehouse(id)?.length ? STATUS_LINK_WAREHOUSE_EN.LINKED : STATUS_LINK_WAREHOUSE_EN.NOT_LINKED } />
      },
    },
    {
      title: "Các kho đã liên kết",
      key: "listWarehouse",
      align: "center",
      width: 180,
      render: (value, record) => {
        const id = record?._id;
        return getListWarehouse(id)?.map((item: any) => (
          <Tag>{item?.name?.vi}</Tag>
        ))
      },
    },
    ...((canDeleteWarehouse || canUpdateWarehouse)
      ? [
          {
            title: "Thao tác",
            key: "action",
            align: "center" as any,
            width: 150,
            render(value: any, record: any, index: any) {
              return <Action id={record?._id} />;
            },
          },
        ]
      : []),
  ];
  return (
    <>
      <Breadcrumb title={t("Danh sách chi nhánh")} />
      <WhiteBox>
        <SelectSearch
          showSelect={false}
          isShowButtonAdd
          handleOnClickButton={openForm}
          permissionKey={[POLICIES.WRITE_BRANCH]}
          onSearch={(e: any) => onParamChange({ keyword: e })}
        />
        <TableAnt
          dataSource={branches}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          scroll={{ x: 300 }}
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showTotal: (total) => `Tổng cộng: ${total}`,
          }}
          stickyTop
        />
      </WhiteBox>
    </>
  );
}
