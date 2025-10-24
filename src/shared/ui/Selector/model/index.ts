export type Option = {
  key: string;
  value: string;
};

export type SelectorProps = {
  label: string;
  options: Option[];
  onChange?: () => void;
};

export type SelectorRef = {
  value: string;
};
