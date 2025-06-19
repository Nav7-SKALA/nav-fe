// components/common/CustomSelect.tsx
import React from 'react';
import Select, { StylesConfig } from 'react-select';

export type OptionType = {
  value: string | number;
  label: string;
};

interface CustomSelectProps {
  options: OptionType[];
  value: OptionType | null;
  onChange: (selected: OptionType) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

const customStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    width: '100%',
    // padding: '2px',
    borderRadius: '10px',
    border: '1px solid #e5e5e5',
    boxShadow: state.isFocused ? '0 0 0 2px #c2e0ff' : '0 1px 4px rgba(0, 0, 0, 0.25)',
    fontSize: '0.8rem',
    color: '#606060',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? '#f4b5b5' : isFocused ? '#ffe1e1' : undefined,
    color: '#606060',
    padding: 10,
    fontSize: '0.8rem',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '10px',
    marginTop: 4,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
  }),
  menuList: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // ✅ Portal이 위로 올라오게
  }),
};

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  isDisabled = false,
}: CustomSelectProps) => {
  return (
    <Select
      styles={customStyles}
      options={options}
      value={value}
      onChange={(option) => onChange(option as OptionType)}
      placeholder={placeholder}
      isDisabled={isDisabled}
      menuPortalTarget={document.body}
    />
  );
};

export default CustomSelect;
