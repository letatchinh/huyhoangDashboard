import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Skeleton,
  Table,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import { get } from "lodash";
import {
  useCreateCollaboratorGroup,
  useDeleteCollaboratorGroup,
  useCollaboratorGroupQueryParams,
  useGetCollaboratorGroup,
  useGetCollaboratorGroups,
  useResetCollaboratorGroups,
  useResourceColumns,
  useUpdateCollaboratorGroup,
} from "../collaboratorGroup.hook";
import {
  useMatchPolicy,
    useUpdateCollaboratorPolicy,
    useResourcesCollaborator,
} from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import WithOrPermission from "~/components/common/WithOrPermission";
import { useDispatch } from "react-redux";
import { collaboratorGroupActions } from "../redux/reducer";
import useNotificationStore from "~/store/NotificationContext";
import { onSearchPermissions, useChangeDocumentTitle } from "~/utils/hook";
import CollaboratorGroupForm from "../components/CollaboratorGroup";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";

const styleButton = {
  alignContent: "center",
  display: "flex",
  alignItems: "center",
};
interface CollaboratorGroupProps {
  currentTab?: string;
};

interface PermissionProps {
  isActive?: boolean;
  onChange?: any;
  disabled?: boolean;
}

interface onPermissionChangeProps {
  resource?: any;
  action?: any;
  isAssgined?: boolean;
}
const Permission = ({ isActive, onChange, disabled }: PermissionProps) => {
  return (
    <Checkbox
      checked={isActive}
      onChange={onChange}
      disabled={disabled}
    ></Checkbox>
  );
};

const CollaboratorGroup = ({ currentTab }: CollaboratorGroupProps) => {
  useResetCollaboratorGroups();
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(collaboratorGroupActions.resetAction());
  };
  const { branchId, groupId }: any = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [reFetch, setReFetch] = useState(false);
  const branchIdParam = useMemo(
    () => ( branchId ? branchId : DEFAULT_BRANCH_ID),
    [branchId, reFetch]
  );
  const [query] = useCollaboratorGroupQueryParams(branchIdParam);
  const [groups, isLoading] = useGetCollaboratorGroups(query);
  const param = useMemo(() => (groupId), [groupId, reFetch]);
  const [group, isLoadingGroup, updateGroup] = useGetCollaboratorGroup(param);
  const [, deleteGroup] = useDeleteCollaboratorGroup();
  const [reFetchId, setReFetchId] = useState<any>(false);
  const reFetchGroup = () => {
    return dispatch(collaboratorGroupActions.getByIdRequest(param));
  };
  const {onNotify} = useNotificationStore();
  //State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [dataShow, setDataShow] = useState(null);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PARTNERGROUP);
  // Action
  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setId(null);
  };

  //Handle Form
  const [, handleUpdateCollaborator] = useUpdateCollaboratorGroup(() => {
    onClose();
    resetAction();
    setReFetchId(true);
  });
  const [isSubmitLoading, handleCreate] = useCreateCollaboratorGroup(() => {
    onClose();
    resetAction();
  });

  // Permission
  const [, handleUpdate] = useUpdateCollaboratorPolicy();
  const [resources, isResourcesLoading] = useResourcesCollaborator();

  useEffect(() => {
    if (!groupId && groups.length && currentTab === 'collaborator/group') {
      navigate(`/collaborator/group/${groups[0]._id}`);
    };
  }, [groups, pathname, groupId]);

  const onSelectGroup = ({ key }: any) => {
    const nextPath = `/collaborator/group/${key}`;
    navigate(nextPath);
  };

  const onPermisionChange = ({
    isAssgined,
    resource,
    action,
  }: onPermissionChangeProps) => {
    try {
      if (!canUpdate) return;
      handleUpdate({ isAssgined, resource, action, groupId });
      updateGroup({ isAssgined, resource, action }); // update Group in store redux
    } catch (error: any) {
      onNotify?.error(get(error, "message", "Some error"));
    }
  };
  const renderPermission = (key: string) => (action: any, rc: any) => {
    const admin = group?.policies?.[rc.key]?.includes("admin");
    return (
      <Permission
        isActive={group?.policies?.[rc.key]?.includes(key)}
        onChange={(event: any) => {
          onPermisionChange({
            isAssgined: event.target.checked,
            resource: rc.key,
            action: key,
          });
        }}
        disabled={(!canUpdate || admin) && key !== "admin"}
      />
    );
  };
  useChangeDocumentTitle("Danh sách nhóm cộng tác viên");
  const columns = useResourceColumns(renderPermission);
  
  return (
    <div className="employee-group">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={7}>
          <div className="employee-group__list">
            <h6 className="employee-group__list-title">Nhóm người dùng</h6>
            <Menu
              className="employee-group__list__menu"
              defaultSelectedKeys={["1"]}
              selectedKeys={[groupId]}
              mode="inline"
              theme="light"
              onSelect={onSelectGroup}
            >
              {isLoading
                ? [1, 2, 3, 4].map((index) => (
                    <Skeleton.Input
                      active
                      key={index}
                      style={{ marginBottom: 10 }}
                    />
                  ))
                : groups.map(({ name, _id }: any) => (
                    <Menu.Item key={_id}>{name} </Menu.Item>
                  ))}
            </Menu>
          </div>
        </Col>

        <Col span={17}>
          <div className="employee-group__content">
            <div className="employee-group__header">
              <h5 className="employee-group__list-title ">Thiết lập quyền</h5>
            { !isLoading && <Flex
                gap="small"
                wrap="wrap"
                style={{
                  alignContent: "center",
                }}
              >
                <WithOrPermission permission={[POLICIES.DELETE_PARTNERGROUP]}>
                <Popconfirm
                  title="Bạn muốn xoá chi nhánh này?"
                  onConfirm={() => deleteGroup(groupId)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <Button
                    size="small"
                    type="primary"
                    danger
                    style={styleButton}
                  >
                    <DeleteOutlined /> Xoá
                  </Button>
                </Popconfirm>{" "}
                </WithOrPermission>
                <WithOrPermission permission={[POLICIES.UPDATE_PARTNERGROUP]}>
                <Button
                  size="small"
                    onClick={() => {
                      onOpenForm(groupId);
                    }}
                  type="primary"
                  style={styleButton}
                >
                  <EditOutlined /> Cập nhật
                </Button>
                </WithOrPermission>
                <WithOrPermission permission={[POLICIES.WRITE_PARTNERGROUP]}>
                <Button
                  style={styleButton}
                  size="small"
                  onClick={() => onOpenForm(null)}
                  type="primary"
                >
                  <PlusOutlined /> Tạo mới
                </Button>
                </WithOrPermission>
              </Flex>}
            </div>
            <SelectSearch
              showSelect={false}
              placeholder="tên quyền"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchPermissions(e.target.value, resources, setDataShow)
              }
              permissionKey={[POLICIES.WRITE_USER]}
            />
            <Table
              columns={columns}
              dataSource={dataShow ?? resources}
              className="employee-group__table"
              pagination={{
                showSizeChanger : true,
                showTotal: (total) => `Tổng cộng: ${total} `,
                size:"small"
              }}
            />
          </div>
        </Col>
      </Row>
        <Modal
          open={isOpen}
          width={600}
          footer={[]}
          onCancel={onClose}
          className="form-modal__user-group"
          afterClose={() => {
              if (reFetchId) {
                reFetchGroup();
            };
            setReFetchId(false);
          }}
      >
        <CollaboratorGroupForm
          isOpen={isOpen} 
          onClose={onClose}
          id={id} 
          setReFetch={setReFetch} 
          reFetch={reFetch}
          handleCreate={handleCreate}
          handleUpdateCollaborator={handleUpdateCollaborator}
          setReFetchId={setReFetchId}
        />
        </Modal>
    </div>
  );
};

export default CollaboratorGroup;
