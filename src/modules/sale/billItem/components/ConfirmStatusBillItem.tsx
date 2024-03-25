import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Popconfirm, Tooltip } from "antd";
import { forIn, get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import WithPermission from "~/components/common/WithPermission";
import PolicyModule from "~/modules/policy";
import { ParamGetNextStatus } from "../billItem.modal";
import { STATUS_BILLITEM, STATUS_BILLITEM_VI } from "../constants";

type propsType = {
  onChangeStatusBillItem: (p: any) => void;
  billItem: any;
  isDisabledAll?: boolean;
  isSubmitLoading?: boolean;
  onOpenCancel: (p: any) => void;
  askAgain?: boolean;
  setAskAgain?: (p: any) => void;
};
const CLONE_STATUS_BILLITEM_VI: any = STATUS_BILLITEM_VI;
export default function ConfirmStatusBillItem({
  onChangeStatusBillItem,
  billItem,
  isDisabledAll,
  isSubmitLoading,
  onOpenCancel,
  askAgain: defaultAskAgain = true,
  setAskAgain: setAskAgainDefault,
}: propsType): React.JSX.Element {
  const [askAgain, setAskAgain] = useState(defaultAskAgain);
  const status = useMemo(() => get(billItem, "status"), [billItem]);
  const getNextStatus = useCallback(
    ({ status, expirationDate, lotNumber }: ParamGetNextStatus) => {
      let nextStatus: any = null;
      let message;
      let isSame = false;
      forIn(STATUS_BILLITEM, (value, key) => {
        if (value === STATUS_BILLITEM.CANCELLED) return;
        if (isDisabledAll) {
          return;
        }
        if (nextStatus) return;
        if (isSame) {
          nextStatus = value;
          if (
            value === STATUS_BILLITEM.PACKAGED &&
            !expirationDate &&
            !lotNumber
          ) {
            message = "Chưa nhập lô và hạn sử dụng";
          }
          return;
        }
        if (status === key) {
          isSame = true;
        }
      });
      return {
        nextStatus,
        message,
      };
    },
    [isDisabledAll]
  );
  const { nextStatus, message } = useMemo(
    () =>
      getNextStatus({
        status,
        lotNumber: get(billItem, "lotNumber"),
        expirationDate: get(billItem, "expirationDate"),
      }),
    [billItem, status]
  );

  return nextStatus ? (
    <WithPermission permission={PolicyModule.POLICIES.UPDATE_BILL}>
      <Flex gap={"small"} align="center" justify={"center"}>
        {defaultAskAgain ? (
          <Popconfirm
            title={
              "Chuyển đổi sang trạng thái " +
              CLONE_STATUS_BILLITEM_VI[nextStatus]
            }
            description={
              <Checkbox
                onChange={(e) => setAskAgain(!e.target.checked)}
                checked={!askAgain}
              >
                Không hỏi lại!
              </Checkbox>
            }
            okText="Ok"
            cancelText="Huỷ"
            onConfirm={() => {
              onChangeStatusBillItem({
                id: get(billItem, "_id", ""),
                status: nextStatus,
              });
              if (setAskAgainDefault) {
                setAskAgainDefault(askAgain);
              }
            }}
          >
            <Tooltip title={message}>
              <Button
                icon={<ArrowUpOutlined />}
                block
                type="primary"
                disabled={isDisabledAll || !!message}
                loading={isSubmitLoading}
              >
                {CLONE_STATUS_BILLITEM_VI[nextStatus]}
              </Button>
            </Tooltip>
          </Popconfirm>
        ) : (
          <Tooltip title={message}>
            <Button
              icon={<ArrowUpOutlined />}
              block
              type="primary"
              disabled={isDisabledAll || !!message}
              loading={isSubmitLoading}
              onClick={() =>
                onChangeStatusBillItem({
                  id: get(billItem, "_id", ""),
                  status: nextStatus,
                })
              }
            >
              {CLONE_STATUS_BILLITEM_VI[nextStatus]}
            </Button>
          </Tooltip>
        )}

        {status === STATUS_BILLITEM.ORDERING && (
          <WithPermission permission={PolicyModule.POLICIES.UPDATE_BILL}>
            <Button
              type="primary"
              block
              danger
              loading={isSubmitLoading}
              onClick={() => onOpenCancel(get(billItem, "_id", ""))}
            >
              Huỷ đơn
            </Button>
          </WithPermission>
        )}
      </Flex>
    </WithPermission>
  ) : (
    <></>
  );
}