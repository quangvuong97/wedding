import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Input, message, Space } from "antd";
import { EditingGuest } from "../admin/menu/GuestManagement/GuestTabContent";
import { GetGuestResponse } from "../../services/api";

function formatNumber(n: string) {
  return n && n !== undefined
    ? String(n)
        .replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";
}

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
    .replace(/,/g, "")
    .trim();
}

function checkValid(str: string) {
  const txt = normalizeInput(str);
  if (txt === "") return "";
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

  const [inputText, setInputText] = useState("");
  const inputRef = useRef<any>(null);
  const caretPosRef = useRef<number>(0);

  // Gán giá trị gốc khi bắt đầu edit
  useEffect(() => {
    if (isEditing) {
      const input = formatNumber(
        record[field as keyof GetGuestResponse]?.toString() || ""
      );
      caretPosRef.current = input.length;
      setInputText(input);
    }
  }, [isEditing, field, record]);

  // Cập nhật con trỏ sau khi value mới ghi ra input
  useLayoutEffect(() => {
    if (isEditing && inputRef.current) {
      console.log("hmmmm", caretPosRef.current);
      inputRef.current.setSelectionRange(
        caretPosRef.current,
        caretPosRef.current
      );
    }
  }, [inputText, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const caretPos = e.target.selectionStart || 0;
    const oldLength = e.target.value.length;

    const newInput = formatNumber(e.target.value);

    const newLength = newInput.length;

    if (inputRef.current) {
      caretPosRef.current = caretPos + (newLength - oldLength);
    }

    setInputText(newInput);
  };

  const handleSave = () => {
    if (!editingGuest) return;

    const result = checkValid(inputText);
    if (result === false) {
      message.error("Không đúng định dạng tiền/vàng");
      return;
    }
    handleSaveEdit({ ...editingGuest, value: result });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setEditingGuest(null);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        autoFocus
        size="small"
        value={inputText}
        onChange={handleChange}
        onPressEnter={handleSave}
        onKeyDown={handleKeyDown}
      />
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
      }}
      className="editable-cell"
    >
      {!text
        ? "-"
        : /^[0-9]+$/.test(String(text).trim())
        ? `${String(text).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`
        : text}
    </div>
  );
};

export default InputPresent;
