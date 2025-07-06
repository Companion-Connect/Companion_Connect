
import React from "react";
import { emojiNameMap } from "./emojiNames";

export const emojiList = Object.keys(emojiNameMap);

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  search: string;
  setSearch: (s: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose, search, setSearch }) => {
  const lowerSearch = search.trim().toLowerCase();
  const filtered = emojiList.filter(e => {
    if (!lowerSearch) return true;
    if (e.includes(lowerSearch)) return true;
    const names = emojiNameMap[e] || [];
    return names.some(name => name.includes(lowerSearch));
  });
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.2)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          minWidth: 320,
          width: "75vw",
          maxWidth: 600,
          height: "50vh",
          maxHeight: 500,
          overflowY: "auto",
          boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        <input
          type="text"
          placeholder="Search emoji..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 8, border: "1px solid #eee" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, overflowY: "auto" }}>
          {filtered.map((emoji, i) => (
            <button key={i} style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer" }} onClick={() => onSelect(emoji)}>{emoji}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
