import React, { useContext, useEffect, useRef, useState } from "react";

import {
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  TimePicker,
} from "antd";
import { filter, head, keys, parseInt, range } from "lodash";
import { formatter } from "~/utils/helpers";
import dayjs from "dayjs";

const EditableContext = React.createContext<FormInstance | null>(null);

const EditableRow = ({ index, ...props }: any) => {
  const [form]: FormInstance[] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  children: React.ReactNode;
  dataIndex: string;
  editable: boolean;
  handleSave: (record: any, dataIndex: string) => void;
  record: any;
  rowIndex: number;
  title: string;
  component: string;
  options?: any[];
  optionsLoading?: boolean;
  availableTime?: { startTime: string; endTime: string };
  required?: boolean;
  max?: number;
}
const EditableCell = ({
  children,
  dataIndex,
  editable,
  handleSave,
  record,
  rowIndex,
  title,

  component,
  options,
  optionsLoading,
  availableTime,
  required,
  max,
  ...restProps
}: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const inputRef: any = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);

    let value;
    switch (component) {
      case "DatePicker":
        value = dayjs.isDayjs(record[dataIndex])
          ? value
          : dayjs(record[dataIndex]);
        break;

      case "TimePicker":
        value = dayjs.isDayjs(record[dataIndex])
          ? value
          : dayjs(record[dataIndex], "HH:mm");
          
        break;

      default:
        value = record[dataIndex];
        break;
    }

    form?.setFieldsValue({
      [dataIndex]: value,
    });
  };

  const toJSON = (values: any) => {
    const key: any = head(keys(values));
    let json: any = {};
    switch (true) {
      case dayjs.isDayjs(values[key]):
        json = {
            [key] : values[key].toISOString()
        }
        break;

      default:
        json = {
          ...values,
        };
        break;
    }

    return json;
  };

  const save = async () => {
    try {
      const values = await form?.validateFields();
      toggleEdit();
      if (max) {
        // Handle max values
        const key: any = head(keys(values));
        if (parseInt(values[key]) > max) {
          values[key] = max;
        }
      }
      const submitData = { ...record, ...toJSON(values) };
      handleSave(submitData, dataIndex);
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: required === false ? false : true,
            message: `Vui lòng nhập ${title}.`,
          },
        ]}
      >
        {
          {
            Input: <Input ref={inputRef} onPressEnter={save} onBlur={save} />,
            InputNumber: (
              <InputNumber
                ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                formatter={(value: any) => formatter(value)}
              />
            ),

            InputNumberOnBlurCapture: (
              <InputNumber
                ref={inputRef}
                onPressEnter={save}
                onBlurCapture={save}
                formatter={(value: any) => formatter(value)}
              />
            ),

            DatePicker: (
              <DatePicker ref={inputRef} onChange={save} onBlur={save} />
            ),
            TimePicker: (
              <TimePicker
                ref={inputRef}
                format="HH:mm"
                onChange={save}
                onBlur={save}
                disabledHours={() => {
                  if (availableTime) {
                    const { startTime, endTime } = availableTime;
                    const startHr = dayjs(startTime, "HH:mm").hour();
                    const endHr = dayjs(endTime, "HH:mm").hour();
                    const res = filter(
                      range(24),
                      (hr) => hr < startHr || hr > endHr
                    );
                    return res;
                  }

                  return [];
                }}
                disabledMinutes={(selectedHr) => {
                  if (availableTime) {
                    const { startTime, endTime } = availableTime;
                    const startHr = dayjs(startTime, "HH:mm").hour();
                    const endHr = dayjs(endTime, "HH:mm").hour();
                    const startMin = dayjs(startTime, "HH:mm").minute();
                    const endMin = dayjs(endTime, "HH:mm").minute();

                    switch (selectedHr) {
                      case startHr:
                        return filter(range(60), (min) => min < startMin);

                      case endHr:
                        return filter(range(60), (min) => min > endMin);

                      default:
                        return [];
                    }
                  }
                  return [];
                }}
              />
            ),
            Select: (
              <Select
                ref={inputRef}
                options={options}
                loading={optionsLoading}
                onChange={save}
                onBlur={save}
              />
            ),
          }[component]
        }
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export { EditableCell, EditableRow };