
import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Input, Popconfirm, Tooltip } from "antd";
import { forIn, get, omit } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { CheckPermission } from "~/utils/helpers";
import { STATUS_BILL, STATUS_BILL_VI } from "../../bill/constants";
import { ParamGetNextStatus } from "../bill.modal";

type propsType = {
  onChangeStatusBill: (p: any, id: string | null| undefined,bill?: any, note?: string) => void;
  bill: any;
  isDisabledAll?: boolean;
  isSubmitLoading?: boolean;
  onOpenCancel: (p: any) => void;
  askAgain?: boolean;
  setAskAgain?: (p: any) => void;
  id?: string | null | undefined;
};
const CLONE_STATUS_BILL_VI: any = omit(STATUS_BILL_VI, ["READY","UNREADY", "REQUESTED","REJECT"]);
const CLONE_STATUS_BILL_VI_REQUESTED: any = omit(STATUS_BILL_VI, ["READY","UNREADY","REJECT"]);
const CLONE_STATUS_BILL: any = omit(STATUS_BILL, ["READY","UNREADY","REQUESTED","REJECT"]);
const CLONE_STATUS_BILL_REQUESTED: any = omit(STATUS_BILL, ["READY","UNREADY","REJECT"]);
export default function ConfirmStatusBill({
  onChangeStatusBill,
  bill,
  isDisabledAll,
  isSubmitLoading,
  onOpenCancel,
  askAgain: defaultAskAgain = true,
  setAskAgain: setAskAgainDefault,
  id,
}: propsType): React.JSX.Element {
  const [askAgain, setAskAgain] = useState(defaultAskAgain);
  const status = useMemo(() => get(bill, "status"), [bill]);
  const {pathname} = useLocation();
  const canUpdateBill = useMatchPolicy([CheckPermission(pathname), 'update']);
  const [note, setNote] = useState<string>("");

  const getNextStatus = useCallback(
    ({ status, expirationDate, lotNumber }: ParamGetNextStatus) => {
      let nextStatus: any = null;
      let message;
      let isSame = false;
      forIn((status === 'REQUESTED' ? CLONE_STATUS_BILL_REQUESTED: CLONE_STATUS_BILL), (value, key) => {
        if (value === CLONE_STATUS_BILL.CANCELLED) return;
        if (isDisabledAll) {
          return;
        }
        if (nextStatus) return;
        if (isSame) {
          nextStatus = value;
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
    [isDisabledAll, bill, id]
  );
  const { nextStatus, message } = useMemo(
    () =>
      getNextStatus({
        status,
        lotNumber: get(bill, "lotNumber"),
        expirationDate: get(bill, "expirationDate"),
      }),
    [bill, status]
  );
  return nextStatus && canUpdateBill ? (
        <Flex gap={"small"} align="center" justify={"center"}>
          {defaultAskAgain ? (
            <Popconfirm
              title={
                "Chuyển đổi sang trạng thái " +
                CLONE_STATUS_BILL_VI[nextStatus]
              }
              description={
                // <Checkbox
                //   onChange={(e) => setAskAgain(!e.target.checked)}
                //   checked={!askAgain}
                // >
                //   Không hỏi lại!
                // </Checkbox>  description={
                <Input.TextArea
                  placeholder="Bắt buộc nhập ghi chú"
                  onChange={(e) => setNote(e.target.value)}
                />
              }
              okText="Ok"
              cancelText="Huỷ"
              onConfirm={() => {
                onChangeStatusBill(nextStatus,id,bill,note);
                if (setAskAgainDefault) {
                  setAskAgainDefault(askAgain);
                }
              }}
            >
              <Tooltip title={message}>
                <Button
                  icon={<ArrowUpOutlined />}
                  block
                  style={{
                    backgroundColor: "#F7F9F2",
                  }}
                  // type="primary"
                  disabled={isDisabledAll || !!message}
                  loading={isSubmitLoading}
                >
                  {(status === 'REQUESTED' ? CLONE_STATUS_BILL_VI_REQUESTED: CLONE_STATUS_BILL_VI)[nextStatus]}
                </Button>
              </Tooltip>
            </Popconfirm>
          ) : (
            <Tooltip title={message}>
              <Button
                icon={<ArrowUpOutlined />}
                block
                // type="primary"
                disabled={isDisabledAll || !!message}
                loading={isSubmitLoading}
                onClick={() =>
                  onChangeStatusBill(nextStatus,id,bill,note)
                }
              >
                {(status === 'REQUESTED' ? CLONE_STATUS_BILL_VI_REQUESTED: CLONE_STATUS_BILL_VI)[nextStatus]}
              </Button>
            </Tooltip>
          )}

          {status === CLONE_STATUS_BILL.NEW && (
            <Popconfirm
            title={'Bạn có chắc chắn muốn huỷ đơn này?'}
            description={
            <Input.TextArea
              placeholder="Bắt buộc nhập ghi chú"
              onChange={(e) => setNote(e.target.value)}
              />
              }
              onConfirm={() => 
              onChangeStatusBill('CANCELLED',id,bill,note)
              }
          
            >
              <Button
                type="primary"
                block
                danger  
                style={{
                  backgroundColor: "rgb(201, 0, 0)",
                }}
                loading={isSubmitLoading}
              >
                Huỷ đơn
              </Button>
              </Popconfirm>
          )}
      </Flex>
  ) : (
    <></>
  );
}
