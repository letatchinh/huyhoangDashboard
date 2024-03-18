import { Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import { StringToSlug } from "~/utils/helpers";
import Action from "../components/Action";
import Address from "../components/Address";
import Member from "../components/Member";
import Relationship from "../components/Relationship";
import SalesGroupForm from "../components/SalesGroupForm";
import TargetSalesGroup from "../components/TargetSalesGroup";
import { SALES_GROUP_GEOGRAPHY_COLOR, SALES_GROUP_GEOGRAPHY_VI } from "../constants";
import {
  useDeleteSalesGroup,
  useGetSalesGroups,
  useGetSalesGroupsSearch,
  useSalesGroupQueryParams,
} from "../salesGroup.hook";
import { SalesGroupType } from "../salesGroup.modal";
import useSalesGroupStore from "../salesGroupContext";
const CLONE_SALES_GROUP_GEOGRAPHY_VI: any = SALES_GROUP_GEOGRAPHY_VI;
const CLONE_SALES_GROUP_GEOGRAPHY_COLOR: any = SALES_GROUP_GEOGRAPHY_COLOR;
export default function SalesGroup() {
  const {
    updateSalesGroup,
    isOpenForm,
    onCloseForm,
    onOpenForm,
    id,
    parentNear,
    isOpenFormRelation,
    onCloseFormRelation,
    isOpenTarget,
    onOpenFormTarget,
    onCloseFormTarget,
  } = useSalesGroupStore();
  const [query] = useSalesGroupQueryParams();
  const [data, isLoading, actionUpdate] = useGetSalesGroups(query);

  const dataSearch = useGetSalesGroupsSearch();
  const [, deleteSalesGroup]: any = useDeleteSalesGroup();

  const onSearch = (keyword: any) => {
    // Get Data Filter From Redux
    const resultSearch = data?.filter((item: SalesGroupType) => {
      const name = get(item, "nameChild", "");
      const member = get(item, "memberChild", "");
      const keywordSlug = StringToSlug(keyword?.trim()?.toLowerCase());
      const nameSlug = StringToSlug(name?.trim()?.toLowerCase());
      const memberSlug = StringToSlug(member?.trim()?.toLowerCase());

      return (
        nameSlug?.includes(keywordSlug) || memberSlug?.includes(keywordSlug)
      );
    });

    actionUpdate(resultSearch);
  };
  const columns: ColumnsType = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, rc) => {
        return (
            <p>
              {`${name} ${
              get(rc, "alias") ? `(${get(rc, "alias")})` : ""
            }`}
              <Address managementArea={get(rc, "managementArea", [])} />
            </p>
        );
      },
    },
    {
      title: "Loại nhóm",
      key: "typeArea",
      dataIndex: "typeArea",
      width: 140,
      align: "center",
      render: (typeArea, rc) => <Tag color={CLONE_SALES_GROUP_GEOGRAPHY_COLOR[typeArea]}>{CLONE_SALES_GROUP_GEOGRAPHY_VI?.[typeArea]}</Tag>
    },
    {
      title: "Chỉ tiêu",
      key: "targets",
      dataIndex: "_id",
      width: "10%",
      align: "center",
      render: (_id, rc) => <Button size="small" onClick={() => onOpenFormTarget(_id)}>Xem chỉ tiêu</Button>
    },
    {
      title: "Thành viên",
      key: "salesGroupPermission",
      dataIndex: "_id",
      width: "30%",
      render: (_id, rc) => (
        <Member
          _id={_id}
          data={get(rc, "salesGroupPermission", [])}
          typeArea={get(rc, "typeArea", "")}
          child={get(rc, "children", [])}
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      fixed: "right",
      width: 80,
      render(_id, rc) {
        return <Action _id={_id} rc={rc} />;
      },
    },
  ];

  return (
    <div>
      <Breadcrumb title={"Nhóm bán hàng"} />
      <WhiteBox>
        <SelectSearch
          onChange={(e: any) => onSearch(e.target.value)}
          handleOnClickButton={() => onOpenForm()}
          showSelect={false}
          isShowButtonAdd
        />
        <TableAnt
          dataSource={dataSearch?.length ? dataSearch : data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={false}
          bordered
        />
      </WhiteBox>
      <ModalAnt
        onCancel={onCloseForm}
        open={isOpenForm}
        footer={null}
        destroyOnClose
      >
        <SalesGroupForm
          onCancel={onCloseForm}
          onUpdate={updateSalesGroup}
          id={id}
          parentNear={get(parentNear, "parentNear")}
          parentNearName={get(parentNear, "parentNearName")}
          parentNearPath={get(parentNear, "parentNearPath")}
        />
      </ModalAnt>
      <ModalAnt
        onCancel={onCloseFormRelation}
        open={isOpenFormRelation}
        footer={null}
        destroyOnClose
        width={"max-content"}
      >
        <Relationship id={id} />
      </ModalAnt>

      <ModalAnt
        onCancel={onCloseFormTarget}
        open={isOpenTarget}
        footer={null}
        destroyOnClose
        width={'auto'}
        className="modalScroll"
        centered
      >
        <TargetSalesGroup _id={id} />
      </ModalAnt>
    </div>
  );
}
