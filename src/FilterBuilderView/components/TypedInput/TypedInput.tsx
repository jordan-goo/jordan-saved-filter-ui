import React, { useEffect, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.ts";
import { ColumnType } from "../../types.ts";

// the generics allow us to narrow the props on the sub input fields
type OnChangeProp<T> = (value: T) => void;

export interface TypedInputProps {
  type: ColumnType;
  onChange: OnChangeProp<Date | Number | string>;
  defaultValue?: Date | Number | string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const TypedInput = ({
  type,
  onChange,
  defaultValue,
  inputRef,
}: TypedInputProps) => {
  switch (type) {
    case ColumnType.NUMBER: {
      return (
        <NumberInput
          inputRef={inputRef}
          onChange={onChange as OnChangeProp<Number>}
          defaultValue={defaultValue as Number}
        />
      );
    }
    case ColumnType.DATE: {
      return (
        <DateInput
          inputRef={inputRef}
          onChange={onChange as OnChangeProp<Date>}
          defaultValue={defaultValue as Date}
        />
      );
    }
    case ColumnType.STRING: {
      return (
        <StringInput
          inputRef={inputRef}
          onChange={onChange as OnChangeProp<string>}
          defaultValue={defaultValue as string}
        />
      );
    }
  }
};

interface StringInputProps {
  defaultValue?: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const StringInput = ({
  defaultValue,
  onChange,
  inputRef,
}: StringInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebouncedValue(value);

  useEffect(() => {
    debouncedValue && onChange(debouncedValue);
  }, [debouncedValue]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setValue(event.target.value);

  return (
    <input
      ref={inputRef}
      onChange={onChangeHandler}
      defaultValue={defaultValue || ""}
    />
  );
};

interface DateInputProps {
  defaultValue?: Date;
  onChange: (value: Date) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const isDate = (value: unknown): value is Date => {
  return value !== undefined && value instanceof Date;
};

const DateInput = ({ defaultValue, onChange, inputRef }: DateInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebouncedValue(value);

  useEffect(() => {
    isDate(debouncedValue) && onChange(debouncedValue);
  }, [debouncedValue]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setValue(new Date(event.target.value));

  return (
    <input
      type="date"
      ref={inputRef}
      onChange={onChangeHandler}
      defaultValue={isDate(defaultValue) ? defaultValue.toISOString() : ""}
    />
  );
};

interface NumberInputProps {
  defaultValue?: Number;
  onChange: (value: Number) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const NumberInput = ({
  defaultValue,
  onChange,
  inputRef,
}: NumberInputProps) => {
  const [value, setValue] = useState(defaultValue || 0);
  const debouncedValue = useDebouncedValue(value);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setValue(Number(event.target.value));

  return (
    <input
      type="number"
      ref={inputRef}
      value={value?.toString() || ""} // we use a controlled input specifically here in order to inforce the number formatting and validation
      onChange={onChangeHandler}
    />
  );
};
