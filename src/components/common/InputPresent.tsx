import React from "react";
import { Input, message, Space } from "antd";
import { EditingGuest } from "../admin/menu/GuestManagement/GuestTabContent";
import { GetGuestResponse } from "../../services/api";

interface InputPresentProps {
  editingGuest: EditingGuest | null;
  setEditingGuest: React.Dispatch<React.SetStateAction<EditingGuest | null>>;
  text: string;
  record: GetGuestResponse;
  field: string;
  handleSaveEdit: (editingGuest: EditingGuest) => Promise<void>;
}

function normalizeInput(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function checkValid(str: string) {
  const txt = normalizeInput(str);
  if (txt === "") return 0;
  if (/^\d{6,}$/.test(txt)) {
    return parseFloat(txt);
  }
  if (/^\d+(\.\d+)?\s*(k|nghin|ngan|trieu|tram|chi)$/i.test(txt)) {
    const num = parseFloat(txt);
    if (txt.includes("k") || txt.includes("nghin") || txt.includes("ngan")) {
      if (num < 100 || num > 999) return false;
      return num * 1000;
    }
    if (txt.includes("tram")) {
      if (num < 0 || num > 9) return false;
      return num * 100000;
    }
    if (txt.includes("trieu")) {
      if (num < 0) return false;
      return num * 1000000;
    }
    if (txt.includes("chi")) {
      if (num < 0) return false;
      return num + " chỉ";
    }
  }
  return false;
}

const InputPresent: React.FC<InputPresentProps> = ({
  editingGuest,
  setEditingGuest,
  text,
  record,
  field,
  handleSaveEdit,
}: InputPresentProps) => {
  const isEditing =
    editingGuest?.id === record.id && editingGuest?.field === field;

  const handleSave = () => {
    if (!editingGuest) {
      console.log("hmm");
      return;
    }
    if (editingGuest && !editingGuest.value)
      setEditingGuest((pre) => ({ ...pre!, value: "0" }));
    const result = checkValid(editingGuest.value);
    if (result === false) {
      message.error("Không đúng định dạng tiền/vàng");
      return;
    }
    setEditingGuest((prev) => (prev ? { ...prev, value: result } : null));
    handleSaveEdit({ ...editingGuest, value: result });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setEditingGuest(null);
    }
  };

  if (isEditing) {
    return (
      <Space size={0}>
        <Input
          autoFocus
          size="small"
          value={editingGuest.value}
          onChange={(e) =>
            setEditingGuest((prev) =>
              prev ? { ...prev, value: e.target.value } : null
            )
          }
          onPressEnter={handleSave}
          onKeyDown={handleKeyDown}
        />
      </Space>
    );
  }

  return (
    <div
      onClick={() =>
        setEditingGuest({
          id: record.id,
          field,
          value: record[field as keyof GetGuestResponse],
        })
      }
      style={{
        cursor: "pointer",
        padding: "4px",
        borderRadius: "4px",
        minHeight: "22px",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
        // ...style,
      }}
      className="editable-cell"
    >
      {text}
    </div>
  );
};

export default InputPresent;
