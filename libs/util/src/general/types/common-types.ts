export type StringRecords<T> = {
  [k in keyof T]: string;
};
